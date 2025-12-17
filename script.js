let transaksi = JSON.parse(localStorage.getItem('trx')) || []
let notes = JSON.parse(localStorage.getItem('notes')) || []

function buka(id,btn){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'))
  document.getElementById(id).classList.add('active')
  document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.remove('active'))
  btn.classList.add('active')
}

function tambah(){
  const n=Number(nominal.value)
  if(!n) return
  transaksi.push({
    n,
    t:tipe.value,
    m:media.value,
    w:new Date().toISOString().split('T')[0]
  })
  nominal.value=''
  simpan()
}

function hapus(i){
  transaksi.splice(i,1)
  simpan()
}

function simpan(){
  localStorage.setItem('trx',JSON.stringify(transaksi))
  render()
  renderCalendar()
}

function render(){
  let s=0,c=0
  list.innerHTML=''
  transaksi.forEach((x,i)=>{
    const v=x.t==='masuk'?x.n:-x.n
    x.m==='saldo'?s+=v:c+=v
    list.innerHTML+=`
    <li class="${x.t}">
      <div class="${x.t==='masuk'?'label-masuk':'label-keluar'}">
        ${x.t.toUpperCase()} ${x.m.toUpperCase()}<br>
        Rp ${x.n.toLocaleString('id-ID')}
      </div>
      <button class="hapus" onclick="hapus(${i})">✕</button>
    </li>`
  })
  saldo.textContent=s.toLocaleString('id-ID')
  cash.textContent=c.toLocaleString('id-ID')
}

function simpanCatatan(){
  if(!note.value) return
  notes.push(note.value)
  note.value=''
  localStorage.setItem('notes',JSON.stringify(notes))
  renderNote()
}

function renderNote(){
  noteList.innerHTML=''
  notes.forEach((n,i)=>{
    noteList.innerHTML+=`
    <li>
      <div>${n}</div>
      <button class="hapus" onclick="hapusNote(${i})">✕</button>
    </li>`
  })
}

function hapusNote(i){
  notes.splice(i,1)
  localStorage.setItem('notes',JSON.stringify(notes))
  renderNote()
}

let now=new Date()
let cm=now.getMonth()
let cy=now.getFullYear()

function renderCalendar(){
  calendar.innerHTML=''
  monthYear.textContent=new Date(cy,cm).toLocaleDateString('id-ID',{month:'long',year:'numeric'})
  const first=new Date(cy,cm,1).getDay()
  const days=new Date(cy,cm+1,0).getDate()
  const today=new Date().toISOString().split('T')[0]

  for(let i=0;i<first;i++) calendar.innerHTML+='<div class="empty"></div>'

  for(let d=1;d<=days;d++){
    const ds=`${cy}-${String(cm+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    const has=transaksi.some(x=>x.w===ds)
    const isToday=ds===today
    calendar.innerHTML+=`
    <div class="${has?'has':''} ${isToday?'today':''}" onclick="selectDate('${ds}')">${d}</div>`
  }
}

function selectDate(d){
  kalenderList.innerHTML=''
  transaksi.filter(x=>x.w===d).forEach(x=>{
    kalenderList.innerHTML+=`
    <li class="${x.t}">
      <span class="${x.t==='masuk'?'label-masuk':'label-keluar'}">
        ${x.t.toUpperCase()} ${x.m.toUpperCase()} - Rp ${x.n.toLocaleString('id-ID')}
      </span>
    </li>`
  })
}

function prevMonth(){cm--;if(cm<0){cm=11;cy--}renderCalendar()}
function nextMonth(){cm++;if(cm>11){cm=0;cy++}renderCalendar()}

render()
renderNote()
renderCalendar()
