/* ==========================================================================
   STACKLY AGRI — LIVE TRACKING & TELEMETRY SEARCH ENGINE
   ========================================================================== */

const MOCK_SHIPMENTS = {
  'AGRI-88210': {
    id: 'AGRI-88210',
    title: 'Premium Organic Honeycrisp Apples',
    origin: 'Green Valley Orchards, Washington',
    destination: 'Central Wholesale Agri Market, Chicago',
    status: 'In Transit · Cold Chain Active',
    badgeClass: 'in-transit',
    eta: 'Tomorrow, 08:30 AM',
    weight: '14,200 kg (Refrigerated Truck #ST-402)',
    temp: '3.4°C (Optimal: 2.0°C - 4.0°C)',
    humidity: '88% RH',
    soilMoisture: '42% (Harvest Sensor Logged)',
    qualityScore: '98.5% (Grade A Premium Certified)',
    driver: 'Marcus Vance · Express Logistics',
    gps: '41.8781° N, 87.6298° W (I-90 Eastbound)',
    timeline: [
      { name: 'Harvest & Sorting', time: 'Aug 18, 06:00 AM', loc: 'Green Valley Field #4', state: 'completed' },
      { name: 'Cold Store Pre-Chill', time: 'Aug 18, 11:30 AM', loc: 'Hub #12 Storage', state: 'completed' },
      { name: 'Cold Chain Dispatch', time: 'Aug 18, 04:00 PM', loc: 'Highway Dispatch', state: 'completed' },
      { name: 'Quality Lab Check', time: 'Aug 19, 09:15 AM', loc: 'Midwest Inspection', state: 'current' },
      { name: 'Final Distribution', time: 'Est. Aug 20, 08:30 AM', loc: 'Chicago Wholesale', state: 'pending' }
    ]
  },
  'CROP-99412': {
    id: 'CROP-99412',
    title: 'Non-GMO Golden Sweet Corn Harvest',
    origin: 'SunRidge Agricultural Hub, Iowa',
    destination: 'Global Bio-Grain Refinery, St. Louis',
    status: 'Quality Inspection Passed',
    badgeClass: 'quality-check',
    eta: 'Today, 04:15 PM',
    weight: '28,500 kg (Grain Silo Carrier #99)',
    temp: '18.2°C (Ambient Grain Stable)',
    humidity: '13.5% Moisture Content',
    soilMoisture: '38% Optimal Harvest',
    qualityScore: '99.1% (Purity Index High)',
    driver: 'Sarah Jenkins · Freight Express',
    gps: '38.6270° N, 90.1994° W',
    timeline: [
      { name: 'Combine Harvest', time: 'Aug 17, 07:00 AM', loc: 'Field Sector B-9', state: 'completed' },
      { name: 'Silo Dehydration', time: 'Aug 17, 02:00 PM', loc: 'SunRidge Processing', state: 'completed' },
      { name: 'Rail Freight Dispatch', time: 'Aug 18, 08:00 AM', loc: 'Iowa Freight Depot', state: 'completed' },
      { name: 'Quality Lab Check', time: 'Aug 19, 10:00 AM', loc: 'St. Louis Terminal', state: 'completed' },
      { name: 'Unloading & Storage', time: 'Est. Aug 19, 04:15 PM', loc: 'Refinery Silo #4', state: 'current' }
    ]
  },
  'FARM-33104': {
    id: 'FARM-33104',
    title: 'Fresh Hydroponic Baby Spinach',
    origin: 'AeroFarm Tech Greenhouse, California',
    destination: 'FreshMart Supermarkets, San Francisco',
    status: 'Out for Final Delivery',
    badgeClass: 'in-transit',
    eta: 'Today, 11:45 AM',
    weight: '3,800 kg (EV Express Fleet)',
    temp: '4.1°C (Controlled Climate)',
    humidity: '92% RH',
    soilMoisture: 'Hydro-Nutrient Balanced',
    qualityScore: '100% (Zero-Pesticide Clean)',
    driver: 'David Lin · Urban Agri Express',
    gps: '37.7749° N, 122.4194° W',
    timeline: [
      { name: 'Hydroponic Harvest', time: 'Aug 19, 04:00 AM', loc: 'AeroFarm Bay 3', state: 'completed' },
      { name: 'Eco-Packaging', time: 'Aug 19, 05:30 AM', loc: 'Greenhouse Hub', state: 'completed' },
      { name: 'Last-Mile Dispatch', time: 'Aug 19, 07:00 AM', loc: 'SF Route 101', state: 'completed' },
      { name: 'Store Receiving', time: 'Aug 19, 11:45 AM', loc: 'FreshMart SF Market', state: 'current' },
      { name: 'On Shelf Display', time: 'Est. Aug 19, 01:00 PM', loc: 'Produce Aisle 1', state: 'pending' }
    ]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initTrackingEngine();
});

function initTrackingEngine() {
  const trackForm = document.getElementById('trackForm');
  const trackInput = document.getElementById('trackIdInput');
  const quickForm = document.getElementById('quickForm');
  const quickInput = document.getElementById('quickId');

  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  }

  if (trackForm && trackInput) {
    trackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });

    // Check URL parameters for ID
    const urlParams = new URLSearchParams(window.location.search);
    const initialId = urlParams.get('id') || 'AGRI-88210';
    trackInput.value = initialId;
    renderTrackingResult(initialId);
  }
}

function searchSample(id) {
  const trackInput = document.getElementById('trackIdInput');
  if (trackInput) {
    trackInput.value = id;
    renderTrackingResult(id);
  } else {
    window.location.href = `track.html?id=${id}`;
  }
}

function renderTrackingResult(id) {
  const container = document.getElementById('trackResultContainer');
  if (!container) return;

  const data = MOCK_SHIPMENTS[id.toUpperCase()] || MOCK_SHIPMENTS['AGRI-88210'];

  // Update URL state without reload if on track.html
  if (window.history.pushState) {
    const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?id=' + data.id;
    window.history.pushState({path:newurl}, '', newurl);
  }

  let timelineHTML = '';
  data.timeline.forEach((step, idx) => {
    timelineHTML += `
      <div class="timeline-step ${step.state}">
        <div class="step-node">
          ${step.state === 'completed' ? '✓' : idx + 1}
        </div>
        <div class="step-title">${step.name}</div>
        <div class="step-time">${step.time}</div>
        <div class="step-location">📍 ${step.loc}</div>
      </div>
    `;
  });

  container.innerHTML = `
    <div class="track-card reveal active">
      <div class="track-header">
        <div class="batch-info">
          <h2>📦 Shipment #${data.id}</h2>
          <p><strong>Product:</strong> ${data.title}</p>
        </div>
        <div class="badge-status ${data.badgeClass}">
          <span class="live-dot"></span>
          ${data.status}
        </div>
      </div>

      <div class="timeline-wrap">
        <div class="timeline-track">
          <div class="timeline-line">
            <div class="timeline-line-progress"></div>
          </div>
          ${timelineHTML}
        </div>
      </div>

      <div class="telemetry-grid">
        <div class="telemetry-card">
          <div class="tc-icon">❄️</div>
          <div class="tc-info">
            <small>Cold Chain Temp</small>
            <strong>${data.temp}</strong>
            <span>Sensor Log OK</span>
          </div>
        </div>

        <div class="telemetry-card">
          <div class="tc-icon">💧</div>
          <div class="tc-info">
            <small>Relative Moisture</small>
            <strong>${data.humidity}</strong>
            <span>Humidity Optimal</span>
          </div>
        </div>

        <div class="telemetry-card">
          <div class="tc-icon">🛡️</div>
          <div class="tc-info">
            <small>Freshness Score</small>
            <strong>${data.qualityScore}</strong>
            <span>Certified Grade A</span>
          </div>
        </div>

        <div class="telemetry-card">
          <div class="tc-icon">⏱️</div>
          <div class="tc-info">
            <small>Estimated Arrival</small>
            <strong>${data.eta}</strong>
            <span>On Time Dispatch</span>
          </div>
        </div>
      </div>
    </div>

    <div class="track-details-grid">
      <div class="map-view-box">
        <div class="map-sim">
          <div class="map-grid-lines"></div>
          <div class="truck-marker">
            🚛 FLEET #${data.id} IN MOTION
          </div>
        </div>
      </div>

      <div class="cargo-info-box">
        <h3>🌱 Batch Telemetry & Manifest</h3>
        <div class="cargo-list">
          <div class="cargo-item">
            <span>Farm Origin:</span>
            <strong>${data.origin}</strong>
          </div>
          <div class="cargo-item">
            <span>Destination:</span>
            <strong>${data.destination}</strong>
          </div>
          <div class="cargo-item">
            <span>Gross Cargo Weight:</span>
            <strong>${data.weight}</strong>
          </div>
          <div class="cargo-item">
            <span>Carrier / Driver:</span>
            <strong>${data.driver}</strong>
          </div>
          <div class="cargo-item">
            <span>Soil Moisture Log:</span>
            <strong>${data.soilMoisture}</strong>
          </div>
          <div class="cargo-item">
            <span>Live Satellite Coordinates:</span>
            <strong>${data.gps}</strong>
          </div>
        </div>
        <button class="btn btn-emerald" style="margin-top: 1.5rem; width: 100%;" onclick="window.location.href='404.html'">
          📄 Download Blockchain Verification Certificate
        </button>
      </div>
    </div>
  `;
}
