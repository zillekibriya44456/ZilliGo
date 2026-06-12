async function test() {
  try {
    const res = await fetch('http://localhost:5001/api/marketplace/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tourId: 1,
        guideId: 1,
        date: '2026-06-15',
        time: '10:00 AM',
        participants: 1,
        bookingType: 'instant'
      })
    });
    
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

test();
