
  var STORAGE_KEY = 'skincure_appointments';
  var STAFF_CODE = 'skincure2026';

  function getAppointments(){
    try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch(e){ return []; }
  }
  function saveAppointments(list){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  document.getElementById('apptForm').addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('name').value.trim();
    var mobile = document.getElementById('mobile').value.trim();
    var disease = document.getElementById('disease').value;
    var date = document.getElementById('date').value;
    var time = document.getElementById('time').value;
    var notes = document.getElementById('notes').value.trim();

    var entry = {
      name: name, mobile: mobile, disease: disease, date: date, time: time,
      notes: notes, savedAt: new Date().toLocaleString('en-IN')
    };
    var list = getAppointments();
    list.push(entry);
    saveAppointments(list);

    var waText = 'New appointment request%0A' +
      'Name: ' + encodeURIComponent(name) + '%0A' +
      'Mobile: ' + encodeURIComponent(mobile) + '%0A' +
      'Concern: ' + encodeURIComponent(disease) + '%0A' +
      'Date: ' + encodeURIComponent(date) + '%0A' +
      'Time: ' + encodeURIComponent(time) +
      (notes ? ('%0ANotes: ' + encodeURIComponent(notes)) : '');
    var waLink = 'https://wa.me/917828093301?text=' + waText;

    var msg = document.getElementById('formMsg');
    msg.className = 'form-msg ok';
    msg.innerHTML = 'Appointment saved on this device for ' + name + ' — ' + date + ', ' + time + '.<br><a class="wa-link" target="_blank" href="' + waLink + '">Send to clinic on WhatsApp now →</a>';
    document.getElementById('apptForm').reset();
  });

  var staffModal = document.getElementById('staffModal');
  document.getElementById('staffLink').addEventListener('click', function(){
    staffModal.classList.add('open');
  });
  document.getElementById('modalClose').addEventListener('click', function(){
    staffModal.classList.remove('open');
  });
  staffModal.addEventListener('click', function(e){
    if(e.target === staffModal) staffModal.classList.remove('open');
  });

  document.getElementById('pwSubmit').addEventListener('click', function(){
    var val = document.getElementById('pwInput').value;
    if(val === STAFF_CODE){
      document.getElementById('pwBox').style.display = 'none';
      renderAppointments();
      document.getElementById('apptListWrap').style.display = 'block';
    } else {
      document.getElementById('pwInput').style.borderColor = '#C8443B';
    }
  });

  function renderAppointments(){
    var list = getAppointments();
    var tbody = document.getElementById('apptTbody');
    tbody.innerHTML = '';
    document.getElementById('apptCount').textContent = list.length + ' appointment' + (list.length === 1 ? '' : 's') + ' saved on this device';
    if(list.length === 0){
      tbody.innerHTML = '<tr><td colspan="7" class="empty-note">No appointments saved on this device yet.</td></tr>';
      return;
    }
    list.slice().reverse().forEach(function(a){
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + escapeHtml(a.name) + '</td><td>' + escapeHtml(a.mobile) + '</td><td>' + escapeHtml(a.disease) + '</td><td>' + escapeHtml(a.date) + '</td><td>' + escapeHtml(a.time) + '</td><td>' + escapeHtml(a.notes || '—') + '</td><td>' + escapeHtml(a.savedAt) + '</td>';
      tbody.appendChild(tr);
    });
  }
  function escapeHtml(s){
    var d = document.createElement('div');
    d.textContent = s == null ? '' : s;
    return d.innerHTML;
  }

  document.getElementById('exportBtn').addEventListener('click', function(){
    var list = getAppointments();
    var rows = [['Name','Mobile','Concern','Date','Time','Notes','Saved At']];
    list.forEach(function(a){ rows.push([a.name, a.mobile, a.disease, a.date, a.time, a.notes || '', a.savedAt]); });
    var csv = rows.map(function(r){
      return r.map(function(c){ return '"' + String(c).replace(/"/g,'""') + '"'; }).join(',');
    }).join('\n');
    var blob = new Blob([csv], {type:'text/csv'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'skincure-appointments.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  });

  var dateInput = document.getElementById('date');
  var today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
  dateInput.addEventListener('input', function(){
    var picked = new Date(this.value + 'T00:00:00');
    if(!isNaN(picked) && picked.getDay() === 0){
      alert('Skin Cure stays closed on Sundays. Please pick another date.');
      this.value = '';
    }
  });
