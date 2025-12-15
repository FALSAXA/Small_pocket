let transaksi = JSON.parse(localStorage.getItem('trx')) || []
let notes = JSON.parse(localStorage.getItem('notes')) || []
let calcVal = ''

function buka(id,btn){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'))
  document.getElementById(id).classList.add('active')
  document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.remove('active'))
  btn.classList.add('active')
}

function tambah(){
  if(!nominal.value) return
  transaksi.push({
    n:+nominal.value,
    t:tipe.value,
    w:new Date().toISOString().split('T')[0]
  })
  nominal.value=''
  simpan()
}

function simpan(){
  localStorage.setItem('trx',JSON.stringify(transaksi))
  render()
  renderCalendar()
}

function render(){
  let saldo=0
  list.innerHTML=''
  transaksi.forEach(x=>{
    saldo+=x.t==='masuk'?x.n:-x.n
    list.innerHTML+=`
      <li class="${x.t}">
        <div>${x.t.toUpperCase()}</div>
        <div>Rp ${x.n.toLocaleString('id-ID')}</div>
      </li>`
  })
  document.getElementById('saldo').innerText=saldo.toLocaleString('id-ID')
}

function inputCalc(v){calcVal+=v;calc.value=calcVal}
function hitung(){try{calcVal=eval(calcVal).toString();calc.value=calcVal}catch{calc.value='Error'}}
function clearCalc(){calcVal='';calc.value=''}

function simpanCatatan(){
  if(!note.value) return
  notes.push({text:note.value,date:new Date().toLocaleDateString('id-ID')})
  note.value=''
  localStorage.setItem('notes',JSON.stringify(notes))
  renderNote()
}

function renderNote(){
  noteList.innerHTML=''
  notes.forEach(n=>{
    noteList.innerHTML+=`<li>${n.text}<br><small>${n.date}</small></li>`
  })
}

let today=new Date()
let currentMonth=today.getMonth()
let currentYear=today.getFullYear()

function renderCalendar(){
  calendar.innerHTML=''
  monthYear.innerText=new Date(currentYear,currentMonth)
    .toLocaleDateString('id-ID',{month:'long',year:'numeric'})

  const firstDay=new Date(currentYear,currentMonth,1).getDay()
  const days=new Date(currentYear,currentMonth+1,0).getDate()
  const todayStr=new Date().toISOString().split('T')[0]

  for(let i=0;i<firstDay;i++) calendar.innerHTML+='<div class="empty"></div>'

  for(let d=1;d<=days;d++){
    const ds=`${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    const has=transaksi.some(x=>x.w===ds)
    const isToday=ds===todayStr
    calendar.innerHTML+=`
      <div class="${has?'has':''} ${isToday?'today':''}"
           onclick="selectDate('${ds}',this)">${d}</div>`
  }
}

function selectDate(d,el){
  document.querySelectorAll('.calendar-grid div').forEach(x=>x.classList.remove('active'))
  el.classList.add('active')
  kalenderList.innerHTML=''
  const data=transaksi.filter(x=>x.w===d)
  if(!data.length){kalenderList.innerHTML='<li>Tidak ada transaksi</li>';return}
  data.forEach(x=>{
    kalenderList.innerHTML+=`
      <li class="${x.t}">
        ${x.t.toUpperCase()} - Rp ${x.n.toLocaleString('id-ID')}
      </li>`
  })
}

function prevMonth(){currentMonth--;if(currentMonth<0){currentMonth=11;currentYear--}renderCalendar()}
function nextMonth(){currentMonth++;if(currentMonth>11){currentMonth=0;currentYear++}renderCalendar()}

render()
renderNote()
renderCalendar()