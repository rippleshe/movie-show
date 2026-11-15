(() => {
  'use strict';

  const byId = id => document.getElementById(id);
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char =>
    ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
  const number = value => value == null ? '—' : Number(value).toLocaleString('zh-CN');
  const score = value => value == null ? '—' : Number(value).toFixed(2);
  const cleanTitle = title => title.replace(/\s*\(\d{4}\)\s*$/, '')
    .replace(/^(.*),\s*(The|A|An)$/, '$2 $1');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function normalizeFilm(row) {
    return {id: String(row['电影编号']), title: cleanTitle(row['片名']), year: row['上映年份'],
      mean: row['平均分'], ratingCount: row['评分人数'],
      image: row['图片'] || `图片/电影-${row['电影编号']}.jpg`};
  }

  const pageData = window['长页数据'];
  const selectedData = window['导演数据'];
  let chronicleId = pageData.C6['年谱']['导演'][0]['编号'];
  let chronicleStep = 5;
  let chronicleFocusYear = null;
  let chronicleCells = [];
  const featured = selectedData['精选'].map(row => ({
    id: row['导演编号'], name: row['中文名'], image: row['肖像'],
    firstYear: row['首部年'], lastYear: row['最近年'], workCount: row['作品数'],
    films: row['前十'].map(normalizeFilm)
  }));
  const charts = new Map();
  const explorer = byId('director-explorer');
  const exploreSection = byId('explore');
  const input = byId('search-input');
  const results = byId('search-results');
  const detail = byId('detail-view');
  const profile = byId('profile-content');
  const savedDirectors = [];
  const targetIds = [];
  let primaryId = null;
  let insightScope = 'current';
  let insightGroups = [];
  let zoomType = null;
  const zoomDialog = byId('chart-dialog');
  const chartModes = {ratings: 0, career: 0, partners: 0, genres: 0};
  let ratingThreshold = 4;
  let careerMetric = 'mean';
  let genrePeriod = 5;
  let selectedFilmIds = [];
  let activeStudyFilmId = null;
  let selectedStudyDirectorId = null;
  const viewLabels = {
    ratings: {title: '口碑光谱', modes: ['口碑范围', '评分门槛']},
    career: {title: '发行轨迹', modes: ['海报时间轴', '发行间隔']},
    partners: {title: '共同署名', modes: ['影片与导演', '搭档和弦']},
    genres: {title: '类型变化', modes: ['类型构成', '年代变化']}
  };
  let data = null;
  let loading = null;
  let collaborationId = null;
  let scope = 'director';
  let matches = [];
  let activeResult = -1;
  let current = null;
  const analysisCharts = new Map();
  const chartResizeObserver = new ResizeObserver(entries => {
    entries.forEach(({target, contentRect}) => {
      if (!contentRect.width || !contentRect.height) return;
      echarts.getInstanceByDom(target).resize();
      if (['careerPosters', 'creditsNetwork'].includes(target.dataset.template) && target.dataset.studyWidth !== String(Math.round(contentRect.width))) {
        const type = target.dataset.template === 'careerPosters' ? 'career' : 'partners';
        const view = chartView(type, contentRect.width);
        setAnalysisChart(target.id === 'zoom-chart' ? 'zoom' : type, view.template, view.update, view.height);
      }
    });
  });

  function filmCard(film) {
    const image = film.image || data?.images.films[film.id];
    return `<button class="film-card" type="button" data-film-id="${film.id}" title="${escapeHtml(film.title)}"
      aria-label="${escapeHtml(film.title)}，${film.year || '年份未知'}，评分 ${score(film.mean)} / 5">
      <span class="film-image">${image
        ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(film.title)}" loading="lazy">`
        : `<span class="film-placeholder" aria-hidden="true"><svg class="missing-poster-icon" viewBox="0 0 48 56" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="4" y="4" width="40" height="48" rx="3"/><path d="M12 4v48M36 4v48M4 16h8M4 28h8M4 40h8M36 16h8M36 28h8M36 40h8"/>
          <rect x="17" y="15" width="14" height="26" rx="1"/></svg><span class="missing-poster-note">暂无海报</span></span>`}</span>
      <span class="film-info"><span class="film-title">${escapeHtml(film.title)}</span>
      <span class="film-meta"><span>${film.year || '—'}</span><strong aria-label="均分 ${score(film.mean)}，满分五分">${score(film.mean)}</strong></span></span></button>`;
  }

  function renderFeature(id) {
    const director = featured.find(item => item.id === id);
    byId('feature-name').textContent = director.name;
    byId('feature-portrait').innerHTML = `<img src="${escapeHtml(director.image)}"
      alt="${escapeHtml(director.name)}" loading="lazy">
      <p>${director.firstYear}–${director.lastYear}<br>${director.workCount} 部库内作品</p>`;
    byId('feature-films').innerHTML = director.films.map(filmCard).join('');
    byId('feature-more').dataset.directorId = id;
  }

  function renderPage() {
    const stats = pageData['统计'];
    byId('cover-meta').textContent = `${number(stats['导演总数'])} 位导演 · ${number(stats['电影总数'])} 部电影`;
    byId('cover-art').innerHTML = `<img class="cover-portrait" src="${escapeHtml(featured[0].image)}"
      alt="${escapeHtml(featured[0].name)}"><div class="cover-posters">${featured.slice(0, 3).map(director =>
        `<button type="button" data-director-id="${director.id}" aria-label="${escapeHtml(director.name)}">
        <img src="${escapeHtml(director.films[0].image)}" alt="${escapeHtml(director.films[0].title)}"></button>`).join('')}</div>`;
    byId('single-share').textContent = `${(pageData.C1['分档'][0]['数量'] / stats['导演总数'] * 100).toFixed(1)}%`;
    const attention = pageData.C2['头部'];
    byId('attention-share').textContent = `${attention['评分占比'].toFixed(1)}%`;
    byId('attention-directors').textContent = `${number(attention['导演数'])} 位导演`;
    byId('attention-records').textContent = `${number(attention['评分记录数'])} 条评分记录`;
    const colors = window.DIRECTOR_CHARTS.C1.color;
    byId('volume-legend').innerHTML = pageData.C1['分档'].map((row, index) =>
      `<li><i style="background:${colors[index]}"></i><span>${row['标签']}</span><span>${(row['数量'] / stats['导演总数'] * 100).toFixed(2)}%</span></li>`).join('');
    const chronicle = pageData.C6['年谱'];
    byId('career').style.setProperty('--chronicle-row', `${window.DIRECTOR_CHARTS.C6.rowHeight}px`);
    byId('chronicle-people').innerHTML = chronicle['导演'].map((row, index) => {
      const years = chronicle['作品'].filter(film => film['导演序号'] === index).map(film => film['年份']);
      return `<div class="chronicle-person"><button type="button" data-director-id="${row['编号']}"><img src="${escapeHtml(row['肖像'])}" alt="" loading="lazy"><span>
        <strong>${escapeHtml(row['名'])}</strong><span class="chronicle-span">${Math.min(...years)}–${Math.max(...years)}</span></span></button></div>`;
    }).join('');
    byId('feature-selector').innerHTML = featured.map(director =>
      `<option value="${director.id}">${escapeHtml(director.name)}</option>`).join('');
    renderFeature(featured[0].id);

    const pair = selectedData['共创']['组合'][0];
    const portraits = pageData.C5['组合卡'][0];
    byId('collab-feature').innerHTML = `<div class="collab-people">
      <button class="person-card" type="button" data-director-id="${pair['导演A编号']}"><img
        src="${escapeHtml(portraits['肖像A'])}" alt="${escapeHtml(pair['中文名A'])}" loading="lazy">${escapeHtml(pair['中文名A'])}</button>
      <p class="collab-count"><strong>${pair['合作片数']} 部</strong>共同署名</p>
      <button class="person-card" type="button" data-director-id="${pair['导演B编号']}"><img
        src="${escapeHtml(portraits['肖像B'])}" alt="${escapeHtml(pair['中文名B'])}" loading="lazy">${escapeHtml(pair['中文名B'])}</button>
      </div><div class="collab-films">${pair['片单'].slice(0, 3).map(normalizeFilm).map(filmCard).join('')}</div>`;
  }

  function drawChart(element) {
    const key = element.dataset.chart;
    if (charts.has(key)) { charts.get(key).resize(); return; }
    const chart = echarts.init(element, 'vintage');
    chart.setOption(window.DIRECTOR_CHARTS[key]);
    if (reducedMotion) chart.setOption({animation: false});
    chart.on('click', event => {
      if (key === 'C6' && event.data?.periodStart != null) {
        renderChronicleFilms(event.data.periodStart);
        return;
      }
      if (key === 'C5') {
        if (event.dataType === 'edge') renderCollaborationFilms(event.data.pairIndex);
        else if (event.data?.id) renderCollaboration(event.data.id);
        return;
      }
      if (event.data?.movieId) {
        openSearch({type: 'film', id: event.data.movieId});
        return;
      }
      const id = event.data?.id;
      if (/^nm\d+$/.test(id)) openSearch({type: 'director', id});
    });
    charts.set(key, chart);
    chartResizeObserver.observe(element);
    if (key === 'C6') loadData().then(() => {
      byId('chronicle-step').innerHTML = window.DIRECTOR_CHARTS.C6.periodSteps.map(step =>
        `<option value="${step}"${step === chronicleStep ? ' selected' : ''}>${step} 年</option>`).join('');
      byId('chronicle-search').disabled = false;
      byId('chronicle-step').disabled = false;
      renderChronicle();
    });
    if (key === 'C5') loadData().then(() => {
      byId('collab-total').textContent = `${number(data.collaborations.length)} 组合作 · ${number(data.directors.filter(director => director.partnerCount > 0).length)} 位导演`;
      byId('collab-search').disabled = false;
      byId('collab-works').disabled = false;
      document.querySelectorAll('[data-collab-zoom]').forEach(button => { button.disabled = false; });
      renderCollaboration(pageData.C5['组合卡'][0]['导演A编号']);
      byId('collab-loading').hidden = true;
    });
  }

  function setupCharts() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || !entry.target.offsetHeight) return;
        drawChart(entry.target);
        observer.unobserve(entry.target);
      });
    }, {rootMargin: '100px 0px'});
    document.querySelectorAll('[data-chart]').forEach(element => observer.observe(element));
  }

  function loadScript(filename) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = filename;
      script.onload = resolve;
      script.onerror = () => reject(new Error(filename));
      document.head.appendChild(script);
    });
  }

  function readTable(table, columns) {
    return table['行'].map(row => Object.fromEntries(columns.map((key, index) => [key, row[index]])));
  }

  function loadData() {
    if (!loading) loading = (async () => {
      for (const filename of ['数据-导演.js', '数据-电影.js', '数据-关系.js', '数据-合作.js', '图片清单.js', '单片评分数据.js']) {
        await loadScript(filename);
      }
      const source = window['全量'];
      const directors = readTable(source['导演'], ['id', 'englishName', 'name', 'birthYear', 'deathYear',
        'profession', 'workCount', 'ratedCount', 'ratingCount', 'mean', 'bestScore', 'bestTitle',
        'firstYear', 'lastYear', 'jointCount', 'partnerCount']);
      const films = readTable(source['电影'], ['id', 'title', 'year', 'genres', 'ratingCount', 'mean', 'imdbMean', 'imdbCount']);
      directors.forEach((director, index) => {
        director.index = index;
        director.profession ||= '';
        director.name ||= director.englishName;
      });
      films.forEach((film, index) => {
        film.id = String(film.id);
        film.ratingCount ??= 0;
        film.index = index;
        film.title = cleanTitle(film.title);
        film.genres = film.genres ? film.genres.split('|') : [];
      });
      const starts = source['关系']['导演作品起'];
      const indices = source['关系']['导演作品电影'];
      const filmDirectors = Array.from({length: films.length}, () => []);
      directors.forEach((director, index) => indices.slice(starts[index], starts[index + 1])
        .forEach(filmIndex => filmDirectors[filmIndex].push(director)));
      const partners = Array.from({length: directors.length}, () => []);
      source['合作']['行'].forEach(([a, b, count], pairIndex) => {
        partners[a].push({director: directors[b], count, pairIndex});
        partners[b].push({director: directors[a], count, pairIndex});
      });
      const images = window['图片'];
      const filmRatings = window.FILM_RATINGS['电影'];
      data = {directors, films, starts, indices, filmDirectors, partners, filmRatings, collaborations: source['合作']['行'],
        directorsById: new Map(directors.map(director => [director.id, director])),
        filmsById: new Map(films.map(film => [film.id, film])),
        images: {directors: Object.fromEntries(Object.entries(images['导演']).map(([id, file]) => [id, `图片/${file}`])),
                 films: Object.fromEntries(Object.entries(images['电影']).map(([id, file]) => [id, `图片/${file}`]))}};
      return data;
    })();
    return loading;
  }

  function directorFilms(director) {
    return data.indices.slice(data.starts[director.index], data.starts[director.index + 1])
      .map(index => data.films[index]).sort((a, b) => b.ratingCount - a.ratingCount || b.mean - a.mean);
  }

  function renderChronicle() {
    const base = window.DIRECTOR_CHARTS.C6;
    const person = data.directorsById.get(chronicleId);
    const films = directorFilms(person);
    const dated = films.filter(film => film.year != null).sort((a, b) => a.year - b.year || b.ratingCount - a.ratingCount);
    const years = dated.map(film => film.year);
    const first = Math.floor(Math.min(...years) / chronicleStep) * chronicleStep;
    const last = Math.floor(Math.max(...years) / chronicleStep) * chronicleStep;
    const periods = [];
    for (let year = first; year <= last; year += chronicleStep) periods.push(year);
    chronicleCells = periods.map((year, index) => {
      const selected = dated.filter(film => film.year >= year && film.year < year + chronicleStep);
      return {value: [index, 0, selected.length], id: `${person.id}:${year}`, name: String(year), directorName: person.name, periodStart: year,
        period: chronicleStep === 1 ? String(year) : `${year}–${year + chronicleStep - 1}`,
        films: selected.map(film => ({movieId: film.id, name: film.title, year: film.year, mean: film.mean}))};
    });
    const focus = chronicleCells.find(cell => chronicleFocusYear != null &&
      cell.periodStart <= chronicleFocusYear && cell.periodStart + chronicleStep > chronicleFocusYear);
    chronicleCells.forEach(cell => { cell.selected = cell === focus; });
    const root = byId('career');
    root.style.setProperty('--chronicle-row', `${base.rowHeight}px`);
    const element = root.querySelector('[data-chart="C6"]');
    element.style.minWidth = `${Math.max(base.minimumWidth, periods.length * base.cellMinWidth + base.grid.left + base.grid.right)}px`;
    const unknown = films.length - dated.length;
    byId('chronicle-total').textContent = `${number(films.length)} 部作品${years.length ? ` · ${Math.min(...years)}–${Math.max(...years)}` : ''}${unknown ? ` · ${unknown} 部年份未知` : ''}`;
    const image = data.images.directors[person.id];
    byId('chronicle-people').innerHTML = `<div class="chronicle-person"><button type="button" data-director-id="${person.id}" aria-label="查看 ${escapeHtml(person.name)} 的作品">
        ${image ? `<img src="${escapeHtml(image)}" alt="" loading="lazy">` : `<span class="chronicle-portrait" aria-hidden="true">${escapeHtml(person.name[0])}</span>`}
        <span><strong>${escapeHtml(person.name)}</strong></span></button></div>`;
    byId('chronicle-empty').hidden = !!years.length;
    charts.get('C6').setOption({xAxis: [{data: periods.map(String)}], yAxis: [{data: [person.name]}],
      series: [{data: chronicleCells}, {data: dated.length ? [{value: [0, 0, films.length], id: person.id, name: person.name, unknown}] : []}]});
    charts.get('C6').resize();
    renderChronicleFilms(focus?.periodStart);
  }

  function renderChronicleFilms(start) {
    const cell = chronicleCells.find(item => item.periodStart === start);
    chronicleFocusYear = cell ? cell.films[0]?.year ?? start : null;
    const films = cell ? cell.films.map(film => data.filmsById.get(film.movieId))
      : directorFilms(data.directorsById.get(chronicleId)).sort((a, b) => (a.year ?? Infinity) - (b.year ?? Infinity) || b.ratingCount - a.ratingCount);
    byId('chronicle-period-name').textContent = cell ? `${cell.directorName} · ${cell.period}` : '全部作品';
    byId('chronicle-period-count').textContent = `${films.length} 部`;
    byId('chronicle-period-films').innerHTML = films.length ? films.map(filmCard).join('') : '<p>此时段无库内作品</p>';
    byId('chronicle-all').disabled = !cell;
    byId('chronicle-all').hidden = !cell;
    if (cell) charts.get('C6').dispatchAction({type: 'select', seriesIndex: 0, dataIndex: chronicleCells.indexOf(cell)});
    else charts.get('C6').dispatchAction({type: 'unselect', seriesIndex: 0, dataIndex: chronicleCells.map((_, index) => index)});
  }

  function renderCollaboration(id) {
    collaborationId = id;
    const director = data.directorsById.get(id);
    const partners = data.partners[director.index].slice().sort((a, b) => b.count - a.count || a.director.name.localeCompare(b.director.name));
    const positions = window.DIRECTOR_CHARTS.C5.layoutPositions;
    const nodes = [{...positions[0], id, name: director.name, category: 0, value: partners.length},
      ...partners.map((partner, index) => ({...positions[1 + Math.floor(index * (positions.length - 1) / partners.length)],
        id: partner.director.id, name: partner.director.name, category: 1, value: partner.count}))];
    const links = partners.map(partner => ({source: id, target: partner.director.id, value: partner.count,
      name: `${director.name} × ${partner.director.name}`, ratings: data.collaborations[partner.pairIndex][3], pairIndex: partner.pairIndex}));
    const base = window.DIRECTOR_CHARTS.C5.series[0];
    charts.get('C5').setOption({series: [{data: nodes, links, center: base.center, zoom: base.zoom}]});
    byId('collab-focus').textContent = `${director.name}的全部搭档`;
    byId('collab-partner-count').textContent = `${number(partners.length)} 位搭档`;
    byId('collab-search').value = '';
    byId('collab-results').hidden = true;
    byId('collab-results').replaceChildren();
    byId('collab-partner').innerHTML = partners.map(partner => `<option value="${partner.pairIndex}">${escapeHtml(partner.director.name)} · ${partner.count} 部</option>`).join('');
    byId('collab-partner').disabled = !partners.length;
    if (partners.length) renderCollaborationFilms(partners[0].pairIndex);
    else {
      byId('collab-pair-name').textContent = '暂无共同执导记录';
      byId('collab-pair-count').textContent = '';
      byId('collab-pair-films').innerHTML = '';
    }
  }

  function renderCollaborationFilms(pairIndex) {
    const [a, b, count, ratings, indices] = data.collaborations[pairIndex];
    byId('collab-partner').value = String(pairIndex);
    byId('collab-pair-name').textContent = `${data.directors[a].name} × ${data.directors[b].name}`;
    byId('collab-pair-count').textContent = `${count} 部合作影片 · ${number(ratings)} 条评分记录`;
    byId('collab-pair-films').innerHTML = indices.map(index => data.films[index]).sort((first, second) => second.ratingCount - first.ratingCount).map(filmCard).join('');
  }

  function median(films) {
    const values = films.filter(film => film.mean != null).map(film => film.mean).sort((a, b) => a - b);
    if (!values.length) return null;
    const middle = Math.floor(values.length / 2);
    return values.length % 2 ? values[middle] : (values[middle - 1] + values[middle]) / 2;
  }

  async function openSearch(target, navigate = true) {
    if (navigate) {
      exploreSection.scrollIntoView({block: 'start', behavior: reducedMotion ? 'auto' : 'smooth'});
      if (!target) input.focus({preventScroll: true});
    }
    if (!data) {
      byId('search-status').textContent = '正在载入…';
      byId('search-status').hidden = false;
    }
    try {
      await loadData();
    } catch (error) {
      byId('search-status').textContent = '数据未载入，请检查本地数据文件。';
      byId('search-status').hidden = false;
      console.error(error);
      return;
    }
    byId('search-status').hidden = true;
    if (target?.type === 'film') {
      if (target.directorId) showDirector(target.directorId);
      showFilm(target.id);
    }
    else if (target?.id) showDirector(target.id);
    else renderSearch();
  }

  function showSearch() {
    current = null;
    explorer.classList.remove('is-detail');
    detail.hidden = true;
    results.hidden = false;
    byId('search-scope').hidden = false;
    byId('explore-insights').hidden = true;
    renderSearch();
    input.focus();
  }

  function renderSearch() {
    if (!data) return;
    const query = input.value.trim().toLowerCase();
    const candidates = scope === 'director' ? data.directors : data.films;
    if (query) {
      matches = candidates.map(item => {
        const names = scope === 'director' ? [item.name, item.englishName] : [item.title];
        const ranks = names.map(name => {
          const text = name.toLowerCase();
          return text === query ? 0 : text.startsWith(query) ? 1 : text.includes(query) ? 2 : 3;
        });
        return {item, rank: Math.min(...ranks)};
      }).filter(result => result.rank < 3)
        .sort((a, b) => a.rank - b.rank || b.item.ratingCount - a.item.ratingCount)
        .slice(0, 8).map(result => result.item);
    } else matches = [];
    results.hidden = !query;
    activeResult = -1;
    results.innerHTML = matches.length ? matches.map((item, index) => {
      const isDirector = scope === 'director';
      const name = isDirector ? item.name : item.title;
      const image = isDirector ? data.images.directors[item.id] : data.images.films[item.id];
      return `<button class="result" type="button" data-result="${index}">
        ${image ? `<img class="result-image" src="${escapeHtml(image)}" alt="">`
          : `<span class="result-image result-initial" aria-hidden="true">${escapeHtml(name[0])}</span>`}
        <span class="result-name">${escapeHtml(name)}</span><span class="result-meta">${isDirector
          ? `${item.workCount} 部` : item.year || '—'}</span></button>`;
    }).join('') : '<p class="search-status">没有匹配结果</p>';
  }

  function showDirector(id) {
    const director = data.directorsById.get(id);
    if (!director) { showSearch(); return; }
    selectedFilmIds = [];
    activeStudyFilmId = null;
    selectedStudyDirectorId = null;
    current = {type: 'director', item: director, films: directorFilms(director)};
    input.value = '';
    renderSearch();
    renderProfile();
    history.replaceState(null, '', `#director=${id}`);
  }

  function showFilm(id) {
    const film = data.filmsById.get(String(id));
    if (!film) { showSearch(); return; }
    if (current?.type !== 'director' || !current.films.some(item => item.id === film.id)) {
      const director = data.filmDirectors[film.index][0];
      if (director) showDirector(director.id);
      else { current = {type: 'film', item: film}; renderProfile(); }
    }
    current.selectedFilm = film.id;
    input.value = '';
    renderSearch();
    renderFilm(film);
    history.replaceState(null, '', `#film=${id}`);
  }

  function renderProfile() {
    explorer.classList.add('is-detail');
    byId('search-scope').hidden = false;
    detail.hidden = false;
    byId('film-inspector').hidden = true;
    const item = current.item;
    const isDirector = current.type === 'director';
    byId('explore-insights').hidden = !isDirector;
    byId('director-films').hidden = !isDirector;
    if (isDirector) {
      const image = data.images.directors[item.id];
      const years = item.birthYear ? `${item.birthYear}–${item.deathYear || ''}` : '';
      const profession = item.profession.split(',').map(word =>
        ({director: '导演', writer: '编剧', producer: '制片人', actor: '演员', actress: '演员',
          cinematographer: '摄影', editor: '剪辑', composer: '作曲', animation_department: '动画'})[word] || word).join(' · ');
      profile.innerHTML = `<div class="profile-head">${image
        ? `<img class="profile-portrait" src="${escapeHtml(image)}" alt="${escapeHtml(item.name)}">` : ''}
        <div><h2 class="profile-title">${escapeHtml(item.name)}</h2>
        <p class="profile-meta">${escapeHtml(item.englishName)}</p>
        <p class="profile-meta">${escapeHtml([years, profession].filter(Boolean).join(' · '))}</p></div></div>
        <div class="profile-stats"><div><strong>${number(item.workCount)}</strong><span>部作品</span></div>
        <div><strong>${number(item.ratingCount)}</strong><span>评分记录</span></div>
        <div><strong>${score(item.mean)}</strong><span>加权均分</span></div></div>
        <p class="profile-meta profile-summary">影片均分中位 ${score(median(current.films))} · ${item.firstYear || '—'}–${item.lastYear || '—'}</p>
        `;
      byId('director-films').innerHTML = current.films.map(filmCard).join('');
      renderInsights();
    } else profile.innerHTML = '';
    renderSavedDirectors();
    renderComparison();
  }

  function renderFilm(film) {
    const image = data.images.films[film.id];
    const stats = data.filmRatings[film.id];
    const directors = data.filmDirectors[film.index];
    byId('film-inspector').hidden = false;
    byId('film-content').innerHTML = `<div class="film-detail ${image ? 'has-poster' : ''}">${image
      ? `<img class="film-detail-poster" src="${escapeHtml(image)}" alt="${escapeHtml(film.title)}">` : ''}
      <div><h2 class="profile-title">${escapeHtml(film.title)}</h2>
      <p class="profile-meta">${film.year || '—'} · ${escapeHtml(film.genres.join(' / '))}</p></div>
      <div class="film-stats"><div><strong>${score(film.mean)}</strong><span>MovieLens / 5</span></div>
      <div><strong>${score(film.imdbMean)}</strong><span>IMDb / 10</span></div>
      <div><strong>${stats ? score(stats[10]) : '—'}</strong><span>评分中位数</span></div></div>
      <p class="profile-meta film-counts">${number(film.ratingCount)} 条 MovieLens 评分 · ${number(film.imdbCount)} 条 IMDb 评分</p>
      <div class="director-links">${directors.map(director =>
          `<button class="text-button" type="button" data-director-id="${director.id}">${escapeHtml(director.name)}</button>`).join('')}</div></div>`;
    byId('film-rating-empty').hidden = !!stats;
    byId('film-rating-chart').hidden = !stats;
    if (stats) setAnalysisChart('filmRatings', 'filmRatings', {series: [{data: stats.slice(0, 10).map((count, index) =>
      ({name: String(window.FILM_RATINGS['分值'][index]), value: [index, count], share: count / film.ratingCount * 100}))}]});
    byId('director-films').querySelectorAll('.film-card').forEach(button =>
      button.setAttribute('aria-pressed', String(button.dataset.filmId === film.id)));
    byId('film-inspector').scrollIntoView({block: 'nearest', behavior: reducedMotion ? 'auto' : 'smooth'});
  }

  function setAnalysisChart(key, template, update, height = 340) {
    const element = byId(key === 'filmRatings' ? 'film-rating-chart' : key === 'zoom' ? 'zoom-chart' : 'analysis-' + key);
    const context = insightGroups.map(group => group.director.id).join(',');
    const newContext = element.dataset.template !== template || element.dataset.studyContext !== context;
    const base = window.DIRECTOR_TEMPLATES[template];
    element.style.minWidth = base.minimumWidth ? base.minimumWidth + 'px' : '';
    if (key !== 'filmRatings') element.style.height = height + 'px';
    let chart = analysisCharts.get(key);
    if (!chart) {
      chart = echarts.init(element, 'vintage');
      if (key !== 'filmRatings') {
        chart.on('click', event => {
          const point = event.data;
          if (point?.movieIds) selectStudyMovies(point.movieIds, point.directorId);
          else if (point?.movieId) selectStudyMovies([point.movieId]);
        });
        chart.on('mouseover', event => {
          const point = event.data;
          if (point?.movieIds) highlightStudyFilms(point.movieIds);
          else if (point?.movieId) highlightStudyFilms([point.movieId]);
        });
        chart.on('globalout', () => highlightStudyFilms(selectedFilmIds));
      }
      analysisCharts.set(key, chart);
      chartResizeObserver.observe(element);
    }
    chart.resize();
    if (element.dataset.template !== template) {
      chart.setOption(base, true);
      element.dataset.template = template;
    }
    element.dataset.studyWidth = String(Math.round(element.getBoundingClientRect().width));
    chart.setOption(update);
    if (reducedMotion) chart.setOption({animation: false});
    if (template === 'creditsNetwork' && newContext) {
      chart.setOption({series: [{center: base.series[0].center, zoom: base.series[0].zoom}]});
      element.parentElement.scrollTop = Math.max(0, (height - element.parentElement.clientHeight) / 2);
      element.parentElement.scrollLeft = 0;
    }
    element.dataset.studyContext = context;
  }

  function highlightStudyFilms(ids) {
    const selected = new Set(ids);
    document.querySelectorAll('#director-films [data-film-id]').forEach(card => {
      card.classList.toggle('is-linked', selected.has(card.dataset.filmId));
      card.classList.toggle('is-dimmed', selected.size > 0 && !selected.has(card.dataset.filmId));
    });
    for (const [key, chart] of analysisCharts) {
      if (key === 'filmRatings') continue;
      chart.dispatchAction({type: 'downplay'});
      const series = chart.getOption().series;
      series.forEach((item, seriesIndex) => {
        const pending = (item.data || []).map((point, dataIndex) => ({point, dataIndex}));
        while (pending.length) {
          const {point, dataIndex} = pending.pop();
          if (point.children) pending.push(...point.children.map(child => ({point: child})));
          if (point.movieIds?.some(id => selected.has(id)) || selected.has(point.movieId)) {
            chart.dispatchAction({type: 'highlight', seriesIndex,
              ...(item.type === 'treemap' ? {name: point.name} : {dataIndex})});
          }
        }
        (item.links || []).forEach((link, dataIndex) => {
          if (link.movieIds?.some(id => selected.has(id))) chart.dispatchAction({type: 'highlight', seriesIndex, dataIndex, dataType: 'edge'});
        });
      });
    }
  }

  function selectStudyMovies(ids, directorId = null) {
    selectedFilmIds = [...new Set(ids)];
    activeStudyFilmId = selectedFilmIds[0] || null;
    selectedStudyDirectorId = directorId || null;
    renderStudySelection();
    highlightStudyFilms(selectedFilmIds);
  }

  function renderStudySelection() {
    const film = data.filmsById.get(activeStudyFilmId);
    const person = data.directorsById.get(selectedStudyDirectorId);
    byId('study-selection').hidden = !film && !person;
    byId('study-selection-count').textContent = selectedFilmIds.length + ' 部已选';
    byId('study-selection-title').textContent = film?.title || person?.name || '';
    byId('study-view-film').disabled = !film;
    byId('study-view-director').hidden = !person;
    byId('study-view-director').textContent = person ? '查看 ' + person.name : '';
    byId('study-partner').value = selectedStudyDirectorId || '';
    byId('study-selected-films').innerHTML = selectedFilmIds.map(id => {
      const item = data.filmsById.get(id), image = data.images.films[id];
      return '<button type="button" data-study-film="' + id + '" aria-pressed="' + (id === activeStudyFilmId) +
        '" aria-label="选中 ' + escapeHtml(item.title) + '" title="' + escapeHtml(item.title) + '">' +
        (image ? '<img src="' + escapeHtml(image) + '" alt="">' : '<span>' + escapeHtml(item.title) + '</span>') +
        '<span class="study-film-year">' + (item.year || '—') + '</span></button>';
    }).join('');
    byId('zoom-selection').hidden = !film && !person;
    byId('zoom-selected-title').textContent = film?.title || person?.name || '';
    byId('zoom-view-film').disabled = !film;
    byId('zoom-view-director').hidden = !person;
  }


  function renderSavedDirectors() {
    byId('saved-directors').innerHTML = savedDirectors.length ? savedDirectors.map(director => {
      const targetIndex = targetIds.indexOf(director.id);
      const isPrimary = director.id === primaryId;
      const role = isPrimary ? '主导演' : targetIndex >= 0 ? `对比 ${targetIndex + 1}` : '';
      const image = data.images.directors[director.id];
      return `<article class="saved-director ${isPrimary ? 'cohort-0' : targetIndex >= 0 ? `cohort-${targetIndex + 1}` : ''}">
        <div class="saved-heading"><button type="button" data-open-saved="${director.id}">${image ? `<img src="${escapeHtml(image)}" alt="">` : ''}
        <span>${escapeHtml(director.name)}</span></button><button class="saved-remove" type="button" data-remove-saved="${director.id}" aria-label="移出${escapeHtml(director.name)}">×</button></div>
        ${role ? `<p class="saved-role">${role}</p>` : ''}<div class="saved-actions">${!isPrimary ? `
        <button type="button" data-set-primary="${director.id}">设为主导演</button>
        <button type="button" data-toggle-target="${director.id}" ${!primaryId || (targetIds.length === 2 && targetIndex < 0) ? 'disabled' : ''}>${targetIndex >= 0 ? '移出对比' : '加入对比'}</button>` : ''}</div></article>`;
    }).join('') : '<p class="saved-empty">尚未收录</p>';
    const saved = current?.type === 'director' && savedDirectors.some(director => director.id === current.item.id);
    byId('save-director').hidden = current?.type !== 'director';
    byId('save-director').disabled = saved;
    byId('save-director').textContent = saved ? '已在导演架' : '＋ 收进导演架';
    const role = current?.item.id === primaryId ? '主导演' : targetIds.includes(current?.item.id) ? `对比 ${targetIds.indexOf(current.item.id) + 1}` : '';
    byId('browse-state').textContent = current?.type === 'director' ? ['当前浏览', role].filter(Boolean).join(' · ') : '电影详情';
  }

  function refreshComparison() {
    if (!primaryId || !targetIds.length) insightScope = 'current';
    renderSavedDirectors();
    renderComparison();
    renderInsights();
  }

  function renderComparison() {
    byId('comparison-section').hidden = !primaryId;
    if (!primaryId) return;
    const directors = [primaryId, ...targetIds].map(id => data.directorsById.get(id));
    byId('clear-compare').hidden = !targetIds.length;
    if (!targetIds.length) {
      byId('compare-panel').innerHTML = `<p class="compare-empty"><strong>主导演 · ${escapeHtml(directors[0].name)}</strong><br>从导演架选择对比导演</p>`;
      return;
    }
    const rows = [
      ['库内作品', director => director.workCount, number],
      ['评分记录', director => director.ratingCount, number],
      ['加权均分', director => director.mean, score],
      ['影片均分中位', director => median(directorFilms(director)), score],
      ['首末跨度', director => director.lastYear && director.firstYear ? director.lastYear - director.firstYear + 1 : null, value => `${number(value)} 年`]
    ];
    byId('compare-panel').innerHTML = `<table class="data-table"><caption>差值相对主导演</caption><thead><tr><th></th>${directors.map((director, index) =>
      `<th class="cohort-${index}"><span>${index ? `对比 ${index}` : '主导演'}</span><strong>${escapeHtml(director.name)}</strong></th>`).join('')}</tr></thead><tbody>${rows.map(([title, value, format]) => {
        const baseline = value(directors[0]);
        return `<tr><th>${title}</th>${directors.map((director, index) => {
          const amount = value(director);
          const delta = amount == null || baseline == null ? null : Number((amount - baseline).toFixed(2));
          return `<td>${amount == null ? '—' : format(amount)}${index && delta != null ? `<span class="compare-delta">${delta > 0 ? '+' : delta < 0 ? '−' : '±'}${format(Math.abs(delta))}</span>` : ''}</td>`;
        }).join('')}</tr>`;
      }).join('')}</tbody></table>`;
  }

  function renderInsights() {
    if (current?.type !== 'director') return;
    const ready = !!primaryId && targetIds.length > 0;
    if (!ready) insightScope = 'current';
    const directors = insightScope === 'comparison'
      ? [primaryId, ...targetIds].map(id => data.directorsById.get(id)) : [current.item];
    explorer.classList.toggle('is-comparing', insightScope === 'comparison');
    insightGroups = directors.map((director, index) => {
      const films = directorFilms(director), genres = new Map();
      films.forEach(film => film.genres.forEach(genre => genres.set(genre, (genres.get(genre) || 0) + 1)));
      const total = [...genres.values()].reduce((sum, count) => sum + count, 0);
      return {director, films, rated: films.filter(film => film.mean != null), genres,
        shares: new Map([...genres].map(([name, count]) => [name, count / total * 100])),
        partners: data.partners[director.index],
        role: insightScope === 'comparison' ? index ? '对比 ' + index : '主导演' : '当前'};
    });
    byId('insight-director').textContent = insightScope === 'comparison' ? '主导演对比' : current.item.name;
    document.querySelectorAll('[data-insight-scope]').forEach(button => {
      button.disabled = button.dataset.insightScope === 'comparison' && !ready;
      button.setAttribute('aria-pressed', String(button.dataset.insightScope === insightScope));
    });
    const legend = insightGroups.map((group, index) => '<span class="cohort-' + index + '"><i></i>' +
      group.role + ' · ' + escapeHtml(group.director.name) + '</span>').join('');
    byId('cohort-legend').innerHTML = legend;
    byId('zoom-legend').innerHTML = legend;
    document.querySelectorAll('button[data-chart-mode]').forEach(button =>
      button.setAttribute('aria-pressed', String(Number(button.dataset.modeValue) === chartModes[button.dataset.chartMode])));
    byId('threshold-control').hidden = !chartModes.ratings;
    byId('career-metric-control').hidden = !!chartModes.career;
    byId('genre-period-control').hidden = !chartModes.genres;
    byId('rating-threshold-value').textContent = ratingThreshold.toFixed(2);
    document.querySelectorAll('[data-career-metric]').forEach(button =>
      button.setAttribute('aria-pressed', String(button.dataset.careerMetric === careerMetric)));
    for (const type of Object.keys(viewLabels)) {
      const view = chartView(type), element = byId('analysis-' + type);
      element.closest('.insight').dataset.mode = chartModes[type];
      byId('metric-' + type).textContent = view.metric;
      byId('empty-' + type).hidden = !view.empty;
      byId('empty-' + type).textContent = view.empty;
      element.hidden = !!view.empty;
      if (!view.empty) setAnalysisChart(type, view.template, view.update, view.height);
      if (type === 'partners') {
        byId('study-partner').innerHTML = '<option value="">定位署名导演</option>' + view.people.map(person =>
          '<option value="' + person.id + '"' + (person.id === selectedStudyDirectorId ? ' selected' : '') + '>' +
          escapeHtml(person.name) + '</option>').join('');
        byId('study-partner').disabled = !view.people.length;
      }
    }
    renderStudySelection();
    if (zoomDialog.open) renderZoom();
    highlightStudyFilms(selectedFilmIds);
  }

  function chartView(type, width) {
    const groups = insightGroups;
    if (type === 'ratings') {
      const count = groups.reduce((sum, group) => sum + group.rated.length, 0);
      const metric = groups.map(group => group.role + ' ' + group.rated.length + ' 部有评分作品').join(' · ');
      if (!chartModes.ratings) {
        const boxes = [], ticks = [];
        groups.forEach((group, role) => {
          const sorted = group.rated.slice().sort((a, b) => a.mean - b.mean), half = Math.floor(sorted.length / 2);
          if (!sorted.length) { boxes.push({value: [null, null, null, null, null], sample: 0, name: group.director.name, movieIds: []}); return; }
          const q1 = median(half ? sorted.slice(0, half) : sorted), q3 = median(half ? sorted.slice(-half) : sorted);
          const lower = sorted.find(film => film.mean >= q1 - 1.5 * (q3 - q1)).mean;
          const upper = sorted.findLast(film => film.mean <= q3 + 1.5 * (q3 - q1)).mean;
          boxes.push({name: group.director.name, value: [lower, q1, median(sorted), q3, upper], statistic: true,
            itemStyle: window.DIRECTOR_TEMPLATES.ratingsBox.roleStyles[role],
            sample: sorted.length, movieIds: sorted.filter(film => film.mean >= q1 && film.mean <= q3).map(film => film.id)});
          sorted.forEach((film, index) => ticks.push({name: film.title, movieIds: [film.id],
            mean: film.mean, year: film.year, value: [film.mean, role, index]}));
        });
        return {template: 'ratingsBox', metric, empty: count ? '' : '暂无作品评分', height: 260 + groups.length * 68,
          update: {yAxis: [{data: groups.map(group => group.role)}], series: [{data: boxes}, {data: ticks}]}};
      }
      const plots = Array.from({length: 3}, (_, role) => {
        const group = groups[role];
        if (!group || !group.rated.length) return {name: group?.director.name || '', data: []};
        const values = [...new Set([.5, ...group.rated.map(film => film.mean), ratingThreshold, 5])].sort((a, b) => a - b);
        return {name: group.director.name, data: values.map(value => {
          const films = group.rated.filter(film => film.mean >= value);
          return {name: group.director.name, value: [value, group.rated.length ? films.length / group.rated.length * 100 : 0],
            count: films.length, total: group.rated.length, movieIds: films.map(film => film.id)};
        }), ...(role === 0 ? {markLine: {data: [{xAxis: ratingThreshold}]}} : {})};
      });
      return {template: 'ratingsThreshold', metric, empty: count ? '' : '暂无作品评分', height: 350, update: {series: plots}};
    }

    if (type === 'career') {
      if (!chartModes.career) {
        const template = window.DIRECTOR_TEMPLATES.careerPosters;
        const prepared = template.prepareData(groups.map(group => ({role: group.role,
          films: group.films.map(film => ({...film, image: data.images.films[film.id] || '', ratio: template.posterRatios[film.id]}))})),
          width || byId('analysis-career').getBoundingClientRect().width, careerMetric);
        const count = prepared.nodes.length;
        return {template: 'careerPosters', metric: count + ' 部 · 下标' + (careerMetric === 'mean' ? '均分 / 5' : '评分记录'),
          empty: count ? '' : '暂无上映年份', height: prepared.height + 92, update: {
            xAxis: [{min: prepared.first, max: prepared.last}], yAxis: [{max: prepared.height}],
            series: [{data: prepared.nodes}, {data: prepared.labels}]}};
      }
      const rows = [], labels = [];
      groups.forEach((group, role) => {
        const films = group.films.filter(film => film.year != null).sort((a, b) => a.year - b.year || b.ratingCount - a.ratingCount);
        films.slice(1).forEach((film, index) => {
          const previous = films[index], row = rows.length;
          labels.push(group.role + ' · ' + previous.year + '→' + film.year);
          rows.push({name: previous.title + ' → ' + film.title, director: group.director.name,
            before: previous.title, after: film.title, movieIds: [previous.id, film.id],
            value: [previous.year, film.year, row, role, film.year - previous.year]});
        });
      });
      return {template: 'careerGaps', metric: rows.length + ' 段上映年间隔', empty: rows.length ? '' : '至少两部已知年份作品才有间隔',
        height: Math.max(290, rows.length * 34 + 100), update: {yAxis: [{data: labels}], series: [{data: rows}]}};
    }

    if (type === 'partners') {
      const groupIds = new Set(groups.map(group => group.director.id)), links = new Map();
      groups.forEach((group, roleIndex) => group.partners.forEach(partner => {
        const pair = data.collaborations[partner.pairIndex], first = data.directors[pair[0]], second = data.directors[pair[1]];
        const key = [first.id, second.id].sort().join('|');
        if (!links.has(key)) links.set(key, {source: first.id, target: second.id, count: pair[2], roleIndex,
          name: first.name + ' × ' + second.name, movieIds: pair[4].map(index => data.films[index].id)});
      }));
      const relations = [...links.values()], ids = new Set(groups.map(group => group.director.id));
      relations.forEach(link => { ids.add(link.source); ids.add(link.target); });
      const people = [...ids].map(id => {
        const director = data.directorsById.get(id), roleIndex = groups.findIndex(group => group.director.id === id);
        return {id, name: director.name, directorId: id, ...(roleIndex >= 0 ? {roleIndex} : {}),
          movieIds: [...new Set(relations.filter(link => link.source === id || link.target === id).flatMap(link => link.movieIds))]};
      });
      const filmIds = [...new Set(relations.flatMap(link => link.movieIds))];
      const metric = filmIds.length + ' 部共导影片 · ' + relations.length + ' 组搭档';
      const options = people.filter(person => relations.some(link => link.source === person.id || link.target === person.id));
      if (chartModes.partners) {
        const prepared = relations.length ? window.DIRECTOR_TEMPLATES.creditsChord.prepareData(options, relations) : {ribbons: [], nodes: []};
        return {template: 'creditsChord', metric, people: options, empty: relations.length ? '' : '暂无联合执导记录',
          height: 520, update: {series: [{data: prepared.ribbons}, {data: prepared.nodes}]}};
      }
      const films = filmIds.map(id => {
        const film = data.filmsById.get(id);
        return {id: 'film-' + id, name: film.title, image: data.images.films[id] || '', movieIds: [id]};
      });
      const graphLinks = [];
      filmIds.forEach(id => {
        const film = data.filmsById.get(id), credited = data.filmDirectors[film.index];
        credited.forEach(director => {
          if (!ids.has(director.id)) return;
          const role = groups.findIndex(group => group.director.id === director.id), focused = groupIds.has(director.id);
          graphLinks.push({source: focused ? director.id : 'film-' + id, target: focused ? 'film-' + id : director.id,
            name: director.name + ' · ' + film.title, movieIds: [id], roleIndex: role >= 0 ? role : 0});
        });
      });
      const prepared = window.DIRECTOR_TEMPLATES.creditsNetwork.prepareData(
        people.filter(person => groupIds.has(person.id)), films, people.filter(person => !groupIds.has(person.id)), graphLinks,
        Math.max(window.DIRECTOR_TEMPLATES.creditsNetwork.minimumWidth, width || byId('analysis-partners').getBoundingClientRect().width));
      return {template: 'creditsNetwork', metric, people: prepared.nodes.filter(person => person.directorId && person.movieIds.length),
        empty: relations.length ? '' : '暂无联合执导记录', height: prepared.height,
        update: {series: [{data: prepared.nodes, links: prepared.links}]}};
    }

    const order = window.DIRECTOR_TEMPLATES.genresBlocks.genreOrder;
    const names = order.filter(name => groups.some(group => group.genres.has(name)));
    const metric = groups.map(group => group.role + ' ' + group.genres.size + ' 类').join(' · ');
    if (!chartModes.genres) {
      const base = window.DIRECTOR_TEMPLATES.genresBlocks;
      return {template: 'genresBlocks', metric, empty: names.length ? '' : '暂无类型记录', height: groups.length > 1 ? 430 : 340,
        update: {series: [{data: groups.map((group, role) => ({name: group.director.name, value: group.genres.size ? 100 : 0,
          director: group.director.name, movieIds: group.films.map(film => film.id), itemStyle: base.roleStyles[role],
          children: names.map(genre => ({name: group.director.name + ' / ' + genre, genre, director: group.director.name,
            value: group.shares.get(genre) || 0, itemStyle: base.genreStyles[genre],
            movieIds: group.films.filter(film => film.genres.includes(genre)).map(film => film.id)}))}))}]}};
    }
    const years = groups.flatMap(group => group.films.filter(film => film.year != null && film.genres.length).map(film => film.year));
    const first = Math.floor(Math.min(...years) / genrePeriod) * genrePeriod;
    const last = Math.floor(Math.max(...years) / genrePeriod) * genrePeriod;
    const periods = [];
    for (let year = first; year <= last; year += genrePeriod) periods.push(year);
    const plots = [];
    for (let role = 0; role < 3; role++) {
      const group = groups[role];
      const bins = periods.map(year => group ? group.films.filter(film => film.year >= year && film.year < year + genrePeriod) : []);
      order.forEach(genre => plots.push({data: group ? bins.map((films, index) => {
        const tagged = films.filter(film => film.genres.includes(genre)), total = films.reduce((sum, film) => sum + film.genres.length, 0);
        return {name: genre, genre, director: group.director.name, period: periods[index] + '–' + (periods[index] + genrePeriod - 1),
          value: [index, total ? tagged.length / total * 100 : null], movieIds: tagged.map(film => film.id)};
      }) : []}));
    }
    return {template: 'genresHistory', metric, empty: years.length ? '' : '暂无可定位的类型年份',
      height: groups.length * window.DIRECTOR_TEMPLATES.genresHistory.facetHeight + 70, update: {
        legend: {data: names},
        xAxis: Array.from({length: 3}, (_, index) => ({data: groups[index] ? periods.map(year => genrePeriod === 1 ? String(year) : year + '–' + String(year + genrePeriod - 1).slice(-2)) : [], show: index < groups.length})),
        yAxis: Array.from({length: 3}, (_, index) => ({name: groups[index]?.role || '', show: index < groups.length})),
        series: plots}};
  }

  function renderZoom() {
    const view = chartView(zoomType, byId('zoom-chart').getBoundingClientRect().width);
    byId('zoom-title').textContent = viewLabels[zoomType].title;
    byId('zoom-metric').textContent = view.metric;
    byId('zoom-mode').innerHTML = viewLabels[zoomType].modes.map((name, index) =>
      '<option value="' + index + '"' + (chartModes[zoomType] === index ? ' selected' : '') + '>' + name + '</option>').join('');
    byId('zoom-mode').dataset.chartMode = zoomType;
    byId('zoom-empty').hidden = !view.empty;
    byId('zoom-empty').textContent = view.empty;
    byId('zoom-chart').hidden = !!view.empty;
    if (!view.empty) setAnalysisChart('zoom', view.template, view.update, view.height);
    renderStudySelection();
    highlightStudyFilms(selectedFilmIds);
  }

  function openHash() {
    const values = new URLSearchParams(location.hash.slice(1));
    const director = values.get('director') || values.get('导演');
    const film = values.get('film') || values.get('影片');
    if (director) openSearch({type: 'director', id: director});
    else if (film) openSearch({type: 'film', id: film});
  }

  byId('feature-selector').addEventListener('change', event => renderFeature(event.target.value));
  input.addEventListener('input', () => {
    if (data) renderSearch(); else openSearch(null, false);
  });
  input.addEventListener('keydown', event => {
    if (['ArrowDown', 'ArrowUp'].includes(event.key) && matches.length) {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      activeResult = activeResult < 0 ? (step > 0 ? 0 : matches.length - 1)
        : (activeResult + step + matches.length) % matches.length;
      results.querySelectorAll('.result').forEach((button, index) => button.classList.toggle('is-active', index === activeResult));
      results.querySelectorAll('.result')[activeResult].scrollIntoView({block: 'nearest'});
    } else if (event.key === 'Enter' && matches.length) {
      event.preventDefault();
      const item = matches[Math.max(0, activeResult)];
      scope === 'director' ? showDirector(item.id) : showFilm(item.id);
    }
  });
  byId('collab-search').addEventListener('input', event => {
    const query = event.target.value.trim().toLocaleLowerCase();
    const results = byId('collab-results');
    results.hidden = !query;
    if (!query) { results.replaceChildren(); return; }
    const matches = data.directors.filter(director => director.partnerCount > 0 &&
      `${director.name} ${director.englishName}`.toLocaleLowerCase().includes(query));
    results.innerHTML = matches.length ? matches.map(director => `<button type="button" role="option" data-collab-id="${director.id}">${escapeHtml(director.name)}<span>${escapeHtml(director.englishName)} · ${director.partnerCount} 位搭档</span></button>`).join('') : '<p>未找到合作导演</p>';
  });
  byId('chronicle-search').addEventListener('input', event => {
    const query = event.target.value.trim().toLocaleLowerCase();
    const results = byId('chronicle-results');
    results.hidden = !query;
    if (!query) { results.replaceChildren(); return; }
    const matches = data.directors.filter(person => `${person.name} ${person.englishName}`.toLocaleLowerCase().includes(query));
    results.innerHTML = matches.length ? matches.map(person => `<button type="button" role="option" data-chronicle-id="${person.id}">
      ${escapeHtml(person.name)}<span>${escapeHtml(person.englishName)} · ${person.workCount} 部</span></button>`).join('') : '<p>未找到导演</p>';
  });
  byId('chronicle-search').addEventListener('keydown', event => {
    if (event.key === 'Escape') byId('chronicle-results').hidden = true;
    if (event.key === 'Enter') byId('chronicle-results').querySelector('button:not([disabled])')?.click();
  });
  byId('chronicle-results').addEventListener('click', event => {
    const button = event.target.closest('[data-chronicle-id]');
    if (!button || button.disabled) return;
    chronicleId = button.dataset.chronicleId;
    chronicleFocusYear = null;
    byId('chronicle-search').value = '';
    byId('chronicle-results').hidden = true;
    byId('chronicle-results').replaceChildren();
    renderChronicle();
  });
  byId('chronicle-all').addEventListener('click', () => renderChronicleFilms());
  byId('chronicle-step').addEventListener('change', event => {
    chronicleStep = Number(event.target.value);
    renderChronicle();
  });
  byId('collab-search').addEventListener('keydown', event => {
    if (event.key === 'Escape') byId('collab-results').hidden = true;
    if (event.key === 'Enter') byId('collab-results').querySelector('button')?.click();
  });
  byId('collab-results').addEventListener('click', event => {
    const button = event.target.closest('[data-collab-id]');
    if (button) renderCollaboration(button.dataset.collabId);
  });
  byId('collab-partner').addEventListener('change', event => renderCollaborationFilms(Number(event.target.value)));
  byId('collab-works').addEventListener('click', () => openSearch({type: 'director', id: collaborationId}));
  document.querySelectorAll('[data-collab-zoom]').forEach(button => button.addEventListener('click', () => {
    const chart = charts.get('C5');
    if (button.dataset.collabZoom === 'reset') {
      const base = window.DIRECTOR_CHARTS.C5.series[0];
      chart.setOption({series: [{center: base.center, zoom: base.zoom}]});
    } else chart.dispatchAction({type: 'graphRoam', zoom: button.dataset.collabZoom === 'in' ? 1.3 : 1 / 1.3,
      originX: chart.getWidth() / 2, originY: chart.getHeight() / 2});
  }));
  byId('search-scope').addEventListener('click', event => {
    const button = event.target.closest('[data-scope]');
    if (!button) return;
    scope = button.dataset.scope;
    byId('search-scope').querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    renderSearch();
  });
  results.addEventListener('click', event => {
    const button = event.target.closest('[data-result]');
    if (!button) return;
    const item = matches[Number(button.dataset.result)];
    scope === 'director' ? showDirector(item.id) : showFilm(item.id);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.collaboration-search')) byId('collab-results').hidden = true;
    if (!event.target.closest('.chronicle-search')) byId('chronicle-results').hidden = true;
    const director = event.target.closest('[data-director-id]');
    const film = event.target.closest('[data-film-id]');
    if (director) openSearch({type: 'director', id: director.dataset.directorId});
    else if (film) openSearch({type: 'film', id: film.dataset.filmId,
      directorId: film.closest('#collab-pair-films') ? collaborationId
        : film.closest('#chronicle-period-films') ? chronicleId : undefined});
  });
  byId('save-director').addEventListener('click', () => {
    savedDirectors.push(current.item);
    renderSavedDirectors();
  });
  byId('saved-directors').addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || button.disabled) return;
    if (button.dataset.openSaved) { showDirector(button.dataset.openSaved); return; }
    if (button.dataset.setPrimary) {
      primaryId = button.dataset.setPrimary;
      const index = targetIds.indexOf(primaryId);
      if (index >= 0) targetIds.splice(index, 1);
    } else if (button.dataset.toggleTarget) {
      const id = button.dataset.toggleTarget;
      const index = targetIds.indexOf(id);
      if (index >= 0) targetIds.splice(index, 1); else targetIds.push(id);
    } else if (button.dataset.removeSaved) {
      const id = button.dataset.removeSaved;
      savedDirectors.splice(savedDirectors.findIndex(director => director.id === id), 1);
      if (id === primaryId) { primaryId = null; targetIds.length = 0; }
      else { const index = targetIds.indexOf(id); if (index >= 0) targetIds.splice(index, 1); }
    }
    refreshComparison();
  });
  byId('clear-compare').addEventListener('click', () => { targetIds.length = 0; refreshComparison(); });
  document.addEventListener('click', event => {
    const scopeButton = event.target.closest('[data-insight-scope]');
    if (scopeButton && !scopeButton.disabled) { insightScope = scopeButton.dataset.insightScope; renderInsights(); }
    const modeButton = event.target.closest('button[data-chart-mode]');
    if (modeButton) { chartModes[modeButton.dataset.chartMode] = Number(modeButton.dataset.modeValue); renderInsights(); }
    const metricButton = event.target.closest('[data-career-metric]');
    if (metricButton) { careerMetric = metricButton.dataset.careerMetric; renderInsights(); }
    const selectedFilm = event.target.closest('[data-study-film]');
    if (selectedFilm) { activeStudyFilmId = selectedFilm.dataset.studyFilm; renderStudySelection(); }
    const zoomButton = event.target.closest('[data-zoom]');
    if (zoomButton) { zoomType = zoomButton.dataset.zoom; zoomDialog.showModal(); document.body.classList.add('chart-open'); renderZoom(); }
  });
  document.addEventListener('change', event => {
    const type = event.target.dataset.chartMode;
    if (!type) return;
    chartModes[type] = Number(event.target.value);
    renderInsights();
  });
  byId('rating-threshold').addEventListener('input', event => { ratingThreshold = Number(event.target.value); renderInsights(); });
  byId('genre-period').addEventListener('change', event => { genrePeriod = Number(event.target.value); renderInsights(); });
  byId('study-partner').addEventListener('change', event => {
    const person = chartView('partners').people.find(person => person.id === event.target.value);
    if (person) {
      selectStudyMovies(person.movieIds, person.id);
      if (!chartModes.partners) {
        const track = byId('analysis-partners').parentElement;
        track.scrollTop = person.scrollY - track.clientHeight / 2;
        track.scrollLeft = person.scrollX - track.clientWidth / 2;
      }
    }
  });
  byId('study-clear').addEventListener('click', () => selectStudyMovies([]));
  for (const id of ['study-view-film', 'zoom-view-film']) byId(id).addEventListener('click', () => {
    if (zoomDialog.open) zoomDialog.close();
    const directors = data.filmDirectors[data.filmsById.get(activeStudyFilmId).index];
    const context = directors.find(director => director.id === current.item.id) || directors[0];
    openSearch({type: 'film', id: activeStudyFilmId, directorId: context?.id});
  });
  for (const id of ['study-view-director', 'zoom-view-director']) byId(id).addEventListener('click', () => {
    if (zoomDialog.open) zoomDialog.close();
    showDirector(selectedStudyDirectorId);
  });
  byId('close-chart').addEventListener('click', () => zoomDialog.close());
  zoomDialog.addEventListener('close', () => document.body.classList.remove('chart-open'));
  zoomDialog.addEventListener('click', event => { if (event.target === zoomDialog) zoomDialog.close(); });
  document.addEventListener('keydown', event => {
    if (zoomDialog.open) return;
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName);
    if ((event.key === '/' && !typing) || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k')) {
      event.preventDefault();
      openSearch();
    }
  });
  window.addEventListener('hashchange', openHash);
  renderPage();
  setupCharts();
  openHash();
})();
