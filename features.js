
function openEmergencyCard() {
  const lastUpdated = new Date().toLocaleDateString();
  const meds = S.prescriptions.map(p => p.name).join(', ') || 'None provided';
  
  qs('#overlays').innerHTML = `
    <div class="full-overlay" style="background:var(--bg);">
      <div class="header" style="position:relative; z-index:10; background:var(--bg-header); border-bottom:1px solid var(--border-medium); margin: 0 0 20px 0; border-radius: 12px; display:flex; align-items:center;">
         <button class="section-action" style="background:none;border:0;color:var(--text);font-size:16px;padding:12px;cursor:pointer;" onclick="closeOverlay()">← Back</button>
         <div style="flex:1; text-align:center; font-weight:700; color:var(--red);">EMERGENCY CARD</div>
         <div style="width:50px;"></div>
      </div>
      
      <div class="card" style="border:2px solid var(--red); background:var(--panel);">
        <div style="display:flex; justify-content:space-between; margin-bottom:16px;">
          <h2 style="font-size:20px; color:var(--red);">Medical ID</h2>
          <span style="font-size:11px; color:var(--muted);">Updated: ${lastUpdated}</span>
        </div>
        
        <div style="margin-bottom:12px;">
          <div style="font-size:11px; color:var(--muted); text-transform:uppercase;">Name</div>
          <div style="font-size:18px; font-weight:bold; color:var(--text);">${S.user.name || 'Not provided'}</div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
          <div>
            <div style="font-size:11px; color:var(--muted); text-transform:uppercase;">Blood Type</div>
            <div style="font-size:16px; font-weight:600; color:var(--red);">${S.user.bloodGroup || 'Not provided'}</div>
          </div>
          <div>
            <div style="font-size:11px; color:var(--muted); text-transform:uppercase;">DOB</div>
            <div style="font-size:16px; font-weight:500; color:var(--text);">Not provided</div>
          </div>
        </div>
        
        <div style="margin-bottom:12px;">
          <div style="font-size:11px; color:var(--muted); text-transform:uppercase;">Allergies</div>
          <div style="font-size:15px; color:var(--text);">${S.user.allergies || 'Not provided'}</div>
        </div>

        <div style="margin-bottom:12px;">
          <div style="font-size:11px; color:var(--muted); text-transform:uppercase;">Current Medicines</div>
          <div style="font-size:15px; color:var(--text);">${meds}</div>
        </div>

        <div style="margin-bottom:20px;">
          <div style="font-size:11px; color:var(--muted); text-transform:uppercase;">Emergency Contact</div>
          <div style="font-size:15px; font-weight:bold; color:var(--text);">${S.user.emergencyName || 'Not provided'}</div>
          ${S.user.emergencyPhone ? `<div style="font-size:14px; color:var(--text); margin-top:4px;">${S.user.emergencyPhone}</div>` : ''}
        </div>

        <div style="display:grid; gap:10px;">
          ${S.user.emergencyPhone ? `<a href="tel:${S.user.emergencyPhone}" class="btn" style="background:var(--green); color:#fff; text-decoration:none;">Call ${S.user.emergencyName}</a>` : ''}
          <button class="btn" style="background:var(--red); color:#fff;" onclick="alert('Calling demo emergency services (911/112). Not a real call.')">Call Emergency Services</button>
        </div>
      </div>

      <div style="display:grid; gap:10px; margin-top:20px;">
        <button class="btn secondary" onclick="openEmergencyQR()">Show QR Card</button>
        <button class="btn secondary" onclick="switchTab('settings'); closeOverlay();">Edit Emergency Information</button>
        <button class="btn secondary" onclick="openLockScreenSetup()">Set Up Lock-Screen Access</button>
      </div>
    </div>
  `;
}

function openEmergencyQR() {
  let txt = `DEMO EMERGENCY INFO\nName: ${S.user.name}\nBlood: ${S.user.bloodGroup}\nAllergies: ${S.user.allergies}`;
  let url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(txt)}`;
  qs('#overlays').innerHTML += `
    <div class="overlay" id="qr-overlay">
      <div class="drawer" style="text-align:center;">
         <h3 style="font-size:20px; color:var(--text);">Emergency QR</h3>
         <p style="color:var(--muted); font-size:13px; margin:8px 0;">Demo mode: this QR contains simulated, revocable data. Scanners see an emergency summary.</p>
         <img src="${url}" style="margin:24px 0; border-radius:16px; border:6px solid white; box-shadow:0 8px 32px rgba(0,0,0,0.3);">
         <button class="btn secondary" onclick="qs('#qr-overlay').remove()">Close</button>
      </div>
    </div>
  `;
}

function openLockScreenSetup() {
  qs('#overlays').innerHTML += `
    <div class="overlay" id="lock-setup-overlay">
      <div class="drawer" style="max-height:85vh; overflow-y:auto;">
         <h3 style="font-size:20px; color:var(--text); margin-bottom:12px;">Lock-Screen Access</h3>
         <p style="color:var(--muted); font-size:13px; margin-bottom:16px;">Make your emergency info accessible to first responders without unlocking your phone. (HealthPulse cannot change device settings directly).</p>
         
         <div class="card" style="padding:12px;">
           <h4 style="color:var(--text); margin-bottom:8px;">iPhone (Medical ID)</h4>
           <ol style="color:var(--muted); font-size:13px; padding-left:16px; margin-bottom:12px; line-height:1.5;">
             <li>Open the Apple <b>Health</b> app.</li>
             <li>Tap your profile picture > <b>Medical ID</b>.</li>
             <li>Tap <b>Edit</b>, then enable <b>Show When Locked</b>.</li>
             <li>Copy your HealthPulse details there.</li>
           </ol>
           <button class="btn secondary" style="font-size:13px; padding:8px;" onclick="showToast('Setup not verified on this device.');">Mark as Set Up</button>
         </div>

         <div class="card" style="padding:12px; margin-top:12px;">
           <h4 style="color:var(--text); margin-bottom:8px;">Android (Emergency Info)</h4>
           <ol style="color:var(--muted); font-size:13px; padding-left:16px; margin-bottom:12px; line-height:1.5;">
             <li>Open device <b>Settings</b>.</li>
             <li>Tap <b>Safety & emergency</b> > <b>Emergency information</b>.</li>
             <li>Add your medical info and emergency contacts.</li>
             <li>Ensure lock-screen access is enabled.</li>
           </ol>
           <button class="btn secondary" style="font-size:13px; padding:8px;" onclick="showToast('Setup not verified on this device.');">Mark as Set Up</button>
         </div>

         <p style="color:var(--muted); font-size:11px; text-align:center; margin:16px 0;">Device settings and availability may vary.</p>
         <button class="btn" onclick="qs('#lock-setup-overlay').remove()">Done</button>
      </div>
    </div>
  `;
}

function TravelOverlay() {
  return `
    <div class="full-overlay" style="background:var(--bg); padding:0;">
      <div style="background:var(--panel-light); padding:24px 20px; border-bottom:1px solid var(--border-medium); border-radius: 0 0 24px 24px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <button class="section-action" style="background:none;border:0;color:var(--text);font-size:16px;padding:0;cursor:pointer;" onclick="S.settings.travel=false; sync(); render()">← Back</button>
          <div style="font-weight:700; color:var(--text); font-size:18px;">Travel Mode</div>
          <div style="width:40px;"></div>
        </div>
        <p style="color:var(--muted); font-size:14px; text-align:center; margin-top:16px;">Your comfort matters while you travel.</p>
      </div>

      <div style="padding:20px; padding-bottom:100px;">
        <div class="card" style="text-align:center;">
          <div style="font-size:14px; color:var(--text); margin-bottom:12px;">Travel Session Active</div>
          <div style="display:flex; justify-content:center; gap:10px;">
            <button class="btn secondary" style="width:auto; padding:8px 16px; font-size:13px;" onclick="alert('Session Paused')">Pause</button>
            <button class="btn secondary" style="width:auto; padding:8px 16px; font-size:13px; color:var(--red);" onclick="S.settings.travel=false; sync(); render()">End Session</button>
          </div>
        </div>

        <div class="section-header"><span class="section-title">Move gently while seated</span></div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:24px;">
          ${renderTravelExerciseCard('Ankle Pumps', '3 mins')}
          ${renderTravelExerciseCard('Ankle Circles', '2 mins')}
          ${renderTravelExerciseCard('Seated Heel Raises', '2 mins')}
          ${renderTravelExerciseCard('Seated Toe Raises', '2 mins')}
          ${renderTravelExerciseCard('Gentle Knee Extensions', '3 mins')}
          ${renderTravelExerciseCard('Gentle Seated Marching', '2 mins')}
          ${renderTravelExerciseCard('Shoulder Rolls', '1 min')}
          ${renderTravelExerciseCard('Gentle Neck Relaxation', '2 mins')}
        </div>

        <div class="section-header"><span class="section-title">Rest now</span></div>
        <div style="display:grid; gap:12px; margin-bottom:24px;">
          ${renderTravelRoutineCard('Motion-Sickness Breathing', '5 mins')}
          ${renderTravelRoutineCard('Travel-Anxiety Reset', '3 mins')}
          ${renderTravelRoutineCard('Seated Breathing Visual', '4 mins')}
          ${renderTravelRoutineCard('Waiting-Room Calm', '5 mins')}
          ${renderTravelRoutineCard('Long-Flight Relaxation', '10 mins')}
          ${renderTravelRoutineCard('Gentle Body Relaxation', '6 mins')}
        </div>

        <div class="section-header"><span class="section-title">Ear Comfort</span></div>
        <div class="card" style="cursor:pointer;" onclick="openEarComfort()">
          <h4 style="color:var(--text); font-size:15px; margin-bottom:4px;">Manage Ear Pressure</h4>
          <p style="color:var(--muted); font-size:13px;">Gentle tips for takeoff and landing.</p>
        </div>

        <div class="section-header"><span class="section-title">Reminders</span></div>
        <div class="card">
          <div class="form-group" style="margin-bottom:12px;">
            <label>Interval</label>
            <select style="background:var(--bg-input); color:var(--text); border:1px solid var(--border-medium);">
              <option>Every 30 minutes</option>
              <option>Every 60 minutes</option>
              <option>Every 90 minutes</option>
              <option>Off</option>
            </select>
          </div>
          <button class="btn secondary" onclick="showToast('Demo Reminder: Move gently')">Trigger Reminder Now</button>
          <p style="color:var(--muted); font-size:11px; margin-top:8px;">Background notifications not supported in this demo.</p>
        </div>
      </div>
    </div>
  `;
}

function renderTravelExerciseCard(title, duration) {
  return `
    <div class="card" style="padding:16px; margin:0; cursor:pointer; background:var(--panel); border:1px solid var(--border-medium); transition:0.2s; text-align:center;" onclick="startExercise('${title}')">
      <div style="font-size:24px; margin-bottom:8px;">🧘</div>
      <div style="font-weight:600; color:var(--text); font-size:14px; margin-bottom:4px;">${title}</div>
      <div style="color:var(--muted); font-size:12px;">${duration}</div>
    </div>
  `;
}

function renderTravelRoutineCard(title, duration) {
  return `
    <div class="card" style="padding:16px; margin:0; cursor:pointer; background:var(--panel); border:1px solid var(--border-medium); display:flex; justify-content:space-between; align-items:center;" onclick="startExercise('${title}')">
      <div>
        <div style="font-weight:600; color:var(--text); font-size:15px;">${title}</div>
        <div style="color:var(--muted); font-size:13px; margin-top:4px;">${duration}</div>
      </div>
      <div style="color:var(--primary-hover); font-size:24px;">▶</div>
    </div>
  `;
}

let exTimer = null;
function startExercise(title) {
  qs('#overlays').innerHTML += `
    <div class="overlay" id="exercise-overlay">
      <div class="drawer" style="text-align:center;">
        <h3 style="font-size:22px; color:var(--text); margin-bottom:8px;">${title}</h3>
        <p style="color:var(--muted); font-size:14px; margin-bottom:24px;">Stop if you feel pain, dizziness, breathlessness, or unusual discomfort.</p>
        
        <div style="width:120px; height:120px; border-radius:50%; border:4px solid var(--primary); margin:0 auto 24px; display:grid; place-items:center; font-size:32px; font-weight:bold; color:var(--text);" id="ex-timer-disp">
          3:00
        </div>

        <div style="display:flex; justify-content:center; gap:12px;">
          <button class="btn secondary" style="width:auto; padding:12px 24px;" id="ex-pause" onclick="toggleExercise()">Pause</button>
          <button class="btn" style="width:auto; padding:12px 24px;" onclick="clearInterval(exTimer); qs('#exercise-overlay').remove()">Finish</button>
        </div>
      </div>
    </div>
  `;
  let time = 180;
  exTimer = setInterval(() => {
    time--;
    const el = qs('#ex-timer-disp');
    if(el) {
      el.innerText = Math.floor(time/60) + ':' + String(time%60).padStart(2,'0');
      if(time<=0) { clearInterval(exTimer); el.innerText = "Done!"; }
    } else clearInterval(exTimer);
  }, 1000);
}
function toggleExercise() {
  const btn = qs('#ex-pause');
  if(btn.innerText === 'Pause') { btn.innerText = 'Resume'; clearInterval(exTimer); }
  else { btn.innerText = 'Pause'; /* resume logic mocked */ }
}

function openEarComfort() {
  qs('#overlays').innerHTML += `
    <div class="overlay" id="ear-overlay">
      <div class="drawer">
        <h3 style="font-size:20px; color:var(--text); margin-bottom:8px;">Ear Comfort</h3>
        <p style="color:var(--muted); font-size:13px; margin-bottom:16px;">Help manage ear pressure gently.</p>
        
        <div class="card" style="padding:12px; margin-bottom:12px;">
          <h4 style="color:var(--text); margin-bottom:4px;">Swallowing</h4>
          <p style="color:var(--muted); font-size:13px;">Swallowing may help equalize pressure naturally.</p>
        </div>
        <div class="card" style="padding:12px; margin-bottom:12px;">
          <h4 style="color:var(--text); margin-bottom:4px;">Gentle Yawning</h4>
          <p style="color:var(--muted); font-size:13px;">A gentle jaw movement or yawn opens the eustachian tube.</p>
        </div>
        <div class="card" style="padding:12px; margin-bottom:12px;">
          <h4 style="color:var(--text); margin-bottom:4px;">Chewing or Sipping</h4>
          <p style="color:var(--muted); font-size:13px;">Chew gum or sip water during altitude changes.</p>
        </div>

        <div style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:12px; padding:12px; margin:16px 0;">
          <p style="color:var(--red); font-size:11px; line-height:1.4;">Stop if techniques cause pain. Severe pain or sudden hearing loss requires urgent medical attention. Do not blow forcefully.</p>
        </div>

        <button class="btn" onclick="qs('#ear-overlay').remove()">Done</button>
      </div>
    </div>
  `;
}

function openQR() {
  openEmergencyCard();
}

const style = document.createElement('style');
style.innerHTML = \`
  [data-theme="light"] .card { background: var(--panel); border-color: var(--border-light); }
  [data-theme="light"] .app-shell { background: var(--bg); box-shadow: 0 0 40px rgba(0,0,0,0.1); }
  [data-theme="light"] .header { background: var(--bg-header); border-bottom-color: var(--border-medium); }
  [data-theme="light"] .bottom-nav { background: var(--bg-nav); border-top-color: var(--border-medium); }
  [data-theme="light"] .med-card { background: var(--panel-light); border-color: var(--border-light); }
  [data-theme="light"] details.problem-board { background: var(--panel-light); }
  [data-theme="light"] .form-group input, [data-theme="light"] .form-group select, [data-theme="light"] .form-group textarea { background: var(--bg-input); border-color: var(--border-medium); color: var(--text); }
  [data-theme="light"] .drawer { background: var(--panel); border-color: var(--border-medium); }
  [data-theme="light"] .overlay { background: rgba(255,255,255,0.8); }
  [data-theme="light"] .icon-btn { background: var(--panel-light); }
  [data-theme="light"] .dr-card { background: linear-gradient(135deg, rgba(109, 40, 217, 0.1), var(--panel-light)); }
\`;
document.head.appendChild(style);
