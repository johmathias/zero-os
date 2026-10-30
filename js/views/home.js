/* ZERO OS — Home: a calm overview. Details live inside each section. */
(function () {
  'use strict';
  var Z = window.Z, U = Z.ui, ic = Z.ic, S = Z.store, L = Z.logic, esc = Z.esc, F = Z.forms;

  function clock() {
    var n = Z.nowMin(); return Z.tm(n);
  }
  function card(n, cls, inner, act) { return '<section class="card ' + (cls || '') + ' rz" style="--n:' + n + '"' + (act ? ' data-act="go" data-arg="' + act + '" role="button" tabindex="0"' : '') + '>' + inner + '</section>'; }
  function head(icon, label, link, to) { return '<div class="head"><div class="label">' + ic(icon) + label + '</div>' + (link ? '<button class="link" data-act="go" data-arg="' + to + '">' + link + ic('chevron-right') + '</button>' : '') + '</div>'; }

  function hero() {
    var st = Z.settings(), t = Z.today(), hb = L.dayHabits(t), tasks = L.todayTasks(), money = L.summary(Z.monthStart(t), Z.monthEnd(t));
    var tasksDoneToday = L.tasks().filter(function (x) { return x.done && x.doneAt && Z.ds(new Date(x.doneAt + 3 * 3600e3)) === t; }).length;
    var taskTotal = tasks.length + tasksDoneToday;
    var chal = L.challenge(), rings = [];
    rings.push({ value: hb.rate, color: '#FF6B3D' }); rings.push({ value: taskTotal ? tasksDoneToday / taskTotal : 0, color: '#B565F5' });
    rings.push({ value: chal && !chal.notStarted && !chal.finished ? (chal.doneToday ? 1 : 0) : 0, color: '#FFC93D' });
    var name = st.name ? esc(st.name) : 'there';
    return '<section class="card hero rz" style="--n:1;padding:24px 22px 22px"><div class="row between" style="align-items:flex-start"><div><div class="greet-time">' + Z.greeting() + ',</div><h1 style="font-size:clamp(34px,10vw,44px);font-weight:760;letter-spacing:-.035em;line-height:1.05;margin-top:2px">' + name + '</h1></div>' +
      (st.showTime ? '<div style="text-align:right"><div class="mid num" id="hclock" style="font-weight:300;letter-spacing:-.02em">' + clock() + '</div><div class="small dim">' + Z.fmt(t, { weekday: 'short', day: 'numeric', month: 'short' }) + '</div></div>' : '<div class="small dim">' + Z.fmtLong(t) + '</div>') + '</div>' +
      '<div class="hero-rings" style="margin-top:22px">' + Z.concentricRings(rings, 118) + '<div class="grow stack sm">' +
      '<div class="small"><b style="color:#FF6B3D">' + hb.done + '/' + hb.total + '</b> <span class="muted">habits</span></div>' +
      '<div class="small"><b style="color:#B565F5">' + tasksDoneToday + '/' + taskTotal + '</b> <span class="muted">tasks due</span></div>' +
      '<div class="small"><b style="color:#FFC93D">' + (chal && !chal.notStarted && !chal.finished ? (chal.doneToday ? 'Done' : 'Day ' + chal.dayNo) : '—') + '</b> <span class="muted">challenge</span></div></div></div></section>';
  }
  function dueNow() {
    var list = Z.reminders.dueNow(); if (!list.length) return '';
    return card(2, 'flat', '<div class="head"><div class="label" style="color:var(--acc)">' + ic('bell') + 'Due now</div></div><div class="stack sm">' + list.slice(0, 3).map(function (r) { return '<div class="row small"><span class="dim num" style="width:44px">' + Z.tm(r.at) + '</span><span style="font-weight:600">' + esc(r.title) + '</span></div>'; }).join('') + '</div>');
  }
  function quick() {
    var items = [['list-checks', 'Task', 'addTask', '#B565F5'], ['wallet', 'Spend', 'hSpend', '#34D399'], ['calendar-plus', 'Event', 'addEvent', '#3DB8FF'], ['notebook-pen', 'Journal', 'hJournal', '#F2B8A0']];
    return '<div class="qa rz" style="--n:3">' + items.map(function (i) { return '<button data-act="' + i[2] + '" aria-label="' + i[1] + '"><span class="avatar" style="--c:' + i[3] + '">' + ic(i[0]) + '</span>' + i[1] + '</button>'; }).join('') + '</div>';
  }
  function scheduleCard() {
    var t = Z.today(), items = L.dayItems(t), now = Z.nowMin();
    var upcoming = items.filter(function (x) { return !x.start || (Z.toMin(x.end) != null ? Z.toMin(x.end) : Z.toMin(x.start) + 30) > now; });
    var inner = head('calendar', 'Today’s schedule', 'Open', 'schedule');
    if (!items.length) return card(4, '', inner + U.empty('calendar', 'A clear day', 'Nothing planned yet. Add a class, study block or plan.', { act: 'addEvent', label: 'Add event', icon: 'calendar-plus' }));
    var show = (upcoming.length ? upcoming : items).slice(0, 4);
    inner += '<div class="tl">' + show.map(function (it) { var s = Z.toMin(it.start), e = Z.toMin(it.end), state = ''; if (s != null) { var end = e != null ? e : s + 30; if (end <= now) state = 'past'; else if (s <= now) state = 'now'; } return Z.itemBox(it, 0, state); }).join('') + '</div>';
    if (upcoming.length > 4) inner += '<button class="link" style="margin-top:8px" data-act="go" data-arg="schedule">+ ' + (upcoming.length - 4) + ' more today</button>';
    if (!upcoming.length) inner += '<div class="small dim" style="margin-top:8px">That’s everything for today.</div>';
    return card(4, '', inner);
  }
  function tasksCard() {
    var tasks = L.todayTasks().slice(0, 4), over = L.todayTasks().filter(function (t) { return t.due < Z.today(); }).length;
    var inner = head('target', 'Today’s priorities', 'All tasks', 'plans');
    if (!tasks.length) {
      var anyTasks = L.tasks().length;
      return card(5, '', inner + U.empty(anyTasks ? 'circle-check' : 'list-checks', anyTasks ? 'Nothing due today' : 'No tasks yet', anyTasks ? 'You’re on top of it. Add the next thing when you’re ready.' : 'Add a task with today’s date and it will appear here.', { act: 'addTask', label: 'Add task' }));
    }
    inner += (over ? '<div class="small bad" style="margin:-4px 0 6px">' + over + ' overdue</div>' : '') + '<div class="list">' + tasks.map(function (t) {
      var p = Z.PRIORITY[t.priority || 2];
      return '<div class="item"><button class="check" style="--c:' + p.color + '" data-act="tToggle" data-id="' + t.id + '" aria-label="Complete ' + esc(t.title) + '">' + ic('check') + '</button><button class="grow" data-act="tEdit" data-id="' + t.id + '" style="text-align:left;display:block;min-width:0"><div class="ti">' + esc(t.title) + '</div><div class="su">' + esc(t.cat || 'Personal') + (t.due < Z.today() ? ' · <span class="bad">' + Z.rel(t.due) + '</span>' : '') + '</div></button></div>';
    }).join('') + '</div>';
    return card(5, '', inner);
  }
  function habitsCard() {
    var t = Z.today(), hb = L.dayHabits(t);
    var inner = head('flame', 'Habits', 'Open', 'habits');
    if (!L.habits().length) return card(6, '', inner + U.empty('flame', 'Build a habit', 'Small actions, done daily, change everything.', { act: 'addHabit', label: 'Create a habit' }));
    if (!hb.total) return card(6, '', inner + '<p class="muted small">No habits scheduled for today.</p>');
    inner += '<div class="row" style="gap:16px;margin-bottom:6px">' + U.ring({ size: 70, stroke: 9, value: hb.rate, color: '#FF6B3D', mid: '<div class="mid" style="position:static;font-size:16px;font-weight:720">' + Math.round(hb.rate * 100) + '%</div>' }) + '<div class="small muted">' + (hb.done === hb.total ? 'All done — beautiful.' : (hb.total - hb.done) + ' left today') + '</div></div><div class="list">' + hb.list.slice(0, 4).map(function (h) {
      var d = L.isDone(h, t); return '<div class="item ' + (d ? 'done' : '') + '" style="min-height:52px"><button class="check ' + (d ? 'on' : '') + '" style="--c:' + (h.color || '#FF6B3D') + '" data-act="hHomeToggle" data-id="' + h.id + '" aria-pressed="' + d + '" aria-label="Toggle ' + esc(h.name) + '">' + ic('check') + '</button><div class="grow ti">' + esc(h.name) + '</div>' + (L.habitStreak(h) > 1 ? '<span class="streak">' + ic('flame') + L.habitStreak(h) + '</span>' : '') + '</div>';
    }).join('') + '</div>' + (hb.total > 4 ? '<button class="link" style="margin-top:6px" data-act="go" data-arg="habits">+ ' + (hb.total - 4) + ' more</button>' : '');
    return card(6, '', inner);
  }
  function challengeCard() {
    var c = L.challenge(); if (!c) return '';
    var inner = head('mountain', esc(c.name), 'Open', 'habits');
    inner += '<div class="row" style="gap:16px">' + U.ring({ size: 84, stroke: 10, value: c.done / c.days, color: '#FFC93D', mid: '<div class="mid" style="position:static;font-size:18px;font-weight:740">' + c.pct + '%</div>' }) + '<div class="grow"><div class="mid" style="font-size:21px">' + (c.notStarted ? 'Starts ' + Z.fmt(c.startDate) : c.finished ? 'Finished' : 'Day ' + c.dayNo + ' of ' + c.days) + '</div><div class="small muted" style="margin-top:4px">' + c.done + ' done · ' + c.remaining + ' left' + (c.streak > 1 ? ' · ' + ic('flame') + ' ' + c.streak : '') + '</div></div></div>';
    if (!c.notStarted && !c.finished && !c.doneToday) inner += '<button class="btn primary block" style="margin-top:14px" data-act="cDay" data-date="' + Z.today() + '">' + ic('check') + 'Check in for today</button>';
    return card(7, '', inner);
  }
  function moneyCard() {
    var accs = L.accounts();
    var inner = head('wallet', 'Money', 'Open', 'money');
    if (!accs.length) return card(8, '', inner + U.empty('wallet', 'Track your money', 'Add an account like Cash or M-Pesa, then record what comes in and goes out.', { act: 'addAccount', label: 'Add account' }));
    var t = Z.today(), ms = Z.monthStart(t), sum = L.summary(ms, Z.monthEnd(t)), bud = L.budgetStatus(ms).filter(function (b) { return !b.b.category })[0];
    inner += '<div class="big" style="font-size:34px;margin-bottom:2px">' + U.count(L.totalBalance(), 'money') + '</div><div class="small dim" style="margin-bottom:14px">Total balance</div><div class="grid2"><div><div class="xs dim">Spent this month</div><div style="font-weight:700;font-size:18px">' + Z.money(sum.expense, { compact: true }) + '</div></div><div><div class="xs dim">Earned</div><div class="good" style="font-weight:700;font-size:18px">' + Z.money(sum.income, { compact: true }) + '</div></div></div>';
    if (bud) inner += '<div style="margin-top:14px"><div class="row between xs dim" style="margin-bottom:6px"><span>Monthly budget</span><span class="' + (bud.over ? 'bad' : '') + '">' + (bud.over ? Z.money(-bud.left, { compact: true, bare: true }) + ' over' : Z.money(bud.left, { compact: true, bare: true }) + ' left') + '</span></div>' + U.bar(bud.pct * 100, bud.over ? '#FF6B8A' : '#34D399') + '</div>';
    inner += '<button class="btn sm block" style="margin-top:14px" data-act="addTx">' + ic('plus') + 'Record transaction</button>';
    return card(8, '', inner);
  }
  function uniCard() {
    var list = L.upcomingDeadlines(3, 45);
    var inner = head('graduation-cap', 'University', 'Open', 'plans');
    if (!L.courses().length) return card(9, '', inner + U.empty('graduation-cap', 'Add your courses', 'Track assignments, exams and revision in one place.', { act: 'cNew', label: 'Add a course' }));
    if (!list.length) return card(9, '', inner + '<p class="muted small">No deadlines or exams in the next 45 days.</p>');
    inner += '<div class="list">' + list.map(function (u) {
      var c = L.courseOf(u.courseId), n = Z.diff(Z.today(), u.date), col = u.kind === 'exam' ? '#FF5C6C' : '#FFC93D';
      return '<button class="item tap" data-act="uEdit" data-id="' + u.id + '"><span class="avatar" style="--c:' + col + '">' + ic(u.kind === 'exam' ? 'pen-line' : 'file-text') + '</span><div class="grow"><div class="ti">' + esc(u.title) + '</div><div class="su">' + esc(c ? c.code || c.name : '') + (u.examType && u.examType !== 'regular' ? ' · ' + L.EXAM_TYPES[u.examType] : '') + '</div></div><span class="badge" style="--c:' + (n <= 2 ? 'var(--bad)' : n <= 7 ? 'var(--warn)' : 'var(--ink2)') + '">' + (n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : n + 'd') + '</span></button>';
    }).join('') + '</div>';
    return card(9, '', inner);
  }
  function goalsCard() {
    var gs = L.activeGoals().slice(0, 3);
    var inner = head('trophy', 'Active goals', 'Open', 'plans');
    if (!gs.length) return card(10, '', inner + U.empty('target', 'Set a goal', 'Give your effort a direction — short or long term.', { act: 'gNew', label: 'Create a goal' }));
    inner += '<div class="stack">' + gs.map(function (g) { var p = L.goalProgress(g); return '<div><div class="row between small" style="margin-bottom:6px"><span style="font-weight:620">' + esc(g.title) + '</span><b>' + Math.round(p.pct * 100) + '%</b></div>' + U.bar(p.pct * 100, '#B565F5') + '</div>'; }).join('') + '</div>';
    return card(10, '', inner);
  }
  function journalCard() {
    var j = S.get('journal', 'j_' + Z.today()), done = j && (j.text || '').trim();
    var inner = head('book-open', 'Journal', 'Open', 'journal') + (done ? '<div style="font-family:ui-serif,Georgia,serif;font-size:16px;line-height:1.5;color:var(--ink2);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:12px">' + esc(j.text) + '</div>' : '<p class="muted small" style="margin-bottom:12px">How are you feeling today?</p>') +
      '<div class="row" style="gap:8px;justify-content:space-between">' + Z.MOODS.map(function (m) { return '<button class="iconbtn" style="border:1px solid ' + (j && j.mood === m.v ? m.color : 'var(--line)') + ';background:' + (j && j.mood === m.v ? m.color + '26' : 'var(--card)') + ';color:' + (j && j.mood === m.v ? m.color : 'var(--ink3)') + '" data-act="jQuickMood" data-m="' + m.v + '" aria-label="Mood: ' + m.label + '">' + ic(m.icon) + '</button>'; }).join('') + '</div>' +
      '<button class="btn sm block" style="margin-top:12px" data-act="jOpen" data-arg="' + Z.today() + '">' + ic('pen-line') + (done ? 'Continue today’s entry' : 'Write today’s entry') + '</button>';
    return card(11, '', inner);
  }

  Z.actions.hSpend = function () { F.tx(null, { type: 'expense' }); };
  Z.actions.hJournal = function () { Z.openJournal(Z.today()); };
  Z.actions.hHomeToggle = function (el) {
    var h = S.get('habits', el.dataset.id); if (!h) return; var now = L.toggleHabit(h, Z.today());
    if (now) { el.classList.add('on', 'pulse'); var r = L.dayHabits(Z.today()); if (r.total && r.done === r.total) setTimeout(function () { U.celebrate('All habits done', 'A great day so far.', 'sparkles'); }, 350); }
  };

  Z.views.home = {
    title: 'Home', area: 'home',
    render: function () {
      var cols = [dueNow(), scheduleCard(), tasksCard(), habitsCard(), challengeCard(), moneyCard(), uniCard(), goalsCard(), journalCard()];
      var first = cols.slice(0, 4).join(''), rest = cols.slice(4).join('');
      return '<div class="row between rz" style="--n:0;padding:4px 2px 12px"><div class="row" style="gap:8px">' + Z.syncPill() + '</div><div class="row" style="gap:8px"><button class="iconbtn glass" data-act="go" data-arg="journal" aria-label="Journal">' + ic('book-open') + '</button><button class="iconbtn glass" data-act="go" data-arg="settings" aria-label="Settings">' + ic('settings') + '</button></div></div>' +
        hero() + quick() + '<div class="cols two" style="margin-top:14px">' + first + rest + '</div>';
    },
    mount: function () { },
    onTick: function () { var c = Z.$('#hclock'); if (c) { c.textContent = clock(); return false; } return true; },
    fab: function (el) { F.quickAdd(el); }
  };
})();
