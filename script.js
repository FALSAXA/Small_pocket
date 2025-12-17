let transaksi = JSON.parse(localStorage.getItem('trx')) || []
let notes = JSON.parse(localStorage.getItem('notes')) || []
let cm = new Date().getMonth()
let cy = new Date().getFullYear()

function buka(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'))
  document.getElementById(id).classList.add('active')
  document.querySelectorAll('.bottom-nav button').forEach(b => b.classList.remove('active'))
  btn.classList.add('active')
}

function tambah() {
  const n = Number(document.getElementById('nominal').value)
  if (!n || n <= 0) return
  const d = new Date()
  const w = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  const tipe = document.getElementById('tipe').value
  const media = document.getElementById('media').value
  transaksi.push({ n, t: tipe, m: media, w })
  document.getElementById('nominal').value = ''
  simpan()
}

function hapus(i) {
  transaksi.splice(i, 1)
  simpan()
}

function simpan() {
  localStorage.setItem('trx', JSON.stringify(transaksi))
  render()
  renderCalendar()
}

function render() {
  let s = 0, c = 0
  const list = document.getElementById('list')
  const saldoEl = document.getElementById('saldo')
  const cashEl = document.getElementById('cash')
  
  list.innerHTML = ''
  
  const sorted = [...transaksi].reverse()
  sorted.forEach((x, i) => {
    const originalIndex = transaksi.length - 1 - i
    const v = x.t === 'masuk' ? x.n : -x.n
    x.m === 'saldo' ? s += v : c += v
    
    list.innerHTML += `
    <li class="${x.t}">
      <div class="${x.t==='masuk'?'label-masuk':'label-keluar'}">
        ${x.t.toUpperCase()} ${x.m.toUpperCase()}<br>
        Rp ${x.n.toLocaleString('id-ID')}
      </div>
      <button class="hapus" onclick="hapus(${originalIndex})">✕</button>
    </li>`
  })
  
  saldoEl.textContent = s.toLocaleString('id-ID')
  cashEl.textContent = c.toLocaleString('id-ID')
}

function simpanCatatan() {
  const note = document.getElementById('note')
  if (!note.value.trim()) return
  notes.push(note.value.trim())
  note.value = ''
  localStorage.setItem('notes', JSON.stringify(notes))
  renderNote()
}

function renderNote() {
  const noteList = document.getElementById('noteList')
  noteList.innerHTML = ''
  
  const sorted = [...notes].reverse()
  sorted.forEach((n, i) => {
    const originalIndex = notes.length - 1 - i
    noteList.innerHTML += `
    <li>
      <div>${n}</div>
      <button class="hapus" onclick="hapusNote(${originalIndex})">✕</button>
    </li>`
  })
}

function hapusNote(i) {
  notes.splice(i, 1)
  localStorage.setItem('notes', JSON.stringify(notes))
  renderNote()
}

function renderCalendar() {
  const monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
  const monthYear = document.getElementById('monthYear')
  const calendar = document.getElementById('calendar')
  
  monthYear.textContent = `${monthNames[cm]} ${cy}`
  
  const firstDay = new Date(cy, cm, 1).getDay()
  const daysInMonth = new Date(cy, cm + 1, 0).getDate()
  const today = new Date()
  const isCurrentMonth = today.getMonth() === cm && today.getFullYear() === cy
  
  let html = ''
  
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="empty"></div>'
  }
  
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${cy}-${String(cm + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const hasTransaction = transaksi.some(x => x.w === dateStr)
    const isToday = isCurrentMonth && d === today.getDate()
    
    html += `<div class="${hasTransaction ? 'has' : ''} ${isToday ? 'today' : ''}" onclick="selectDate('${dateStr}')">${d}</div>`
  }
  
  calendar.innerHTML = html
}

function selectDate(d) {
  const kalenderList = document.getElementById('kalenderList')
  kalenderList.innerHTML = ''
  
  const filtered = transaksi.filter(x => x.w === d)
  filtered.forEach(x => {
    kalenderList.innerHTML += `
    <li class="${x.t}">
      <span class="${x.t==='masuk'?'label-masuk':'label-keluar'}">
        ${x.t.toUpperCase()} ${x.m.toUpperCase()} - Rp ${x.n.toLocaleString('id-ID')}
      </span>
    </li>`
  })
}

function prevMonth() {
  cm--
  if (cm < 0) {
    cm = 11
    cy--
  }
  renderCalendar()
  selectDate('')
}

function nextMonth() {
  cm++
  if (cm > 11) {
    cm = 0
    cy++
  }
  renderCalendar()
  selectDate('')
}

render()
renderNote()
renderCalendar()
