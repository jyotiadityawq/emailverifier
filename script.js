document.getElementById('email-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    
    const response = await fetch('https://api.emailverifyapi.com/v3/lookups/json?key=YOUR_API_KEY&email=' + encodeURIComponent(email));
    const result = await response.json();
    
    if (result.deliverable) {
        const otp = Math.floor(100000 + Math.random() * 900000);
        sessionStorage.setItem('otp', otp);
        
        const apiKey = 'Enteryourkeyhere';
        const sendinblueURL = 'https://api.sendinblue.com/v3/smtp/email';

        axios.post(sendinblueURL, {
            sender: { email: 'your-email@example.com' },
            to: [{ email: email }],
            subject: 'Your OTP Code',
            htmlContent: `<p>Your OTP code is: <strong>${otp}</strong></p>`
        }, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey
            }
        }).then(() => {
            document.getElementById('email-form').style.display = 'none';
            document.getElementById('otp-form').style.display = 'block';
        }).catch(error => {
            document.getElementById('message').textContent = "Error sending OTP: " + error.message;
        });
    } else {
        document.getElementById('message').textContent = "Invalid email address.";
    }
});

document.getElementById('otp-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const otp = document.getElementById('otp').value;
    
    if (otp === sessionStorage.getItem('otp')) {
        document.getElementById('message').textContent = "Email verified successfully!";
        document.getElementById('message').style.color = 'green';
    } else {
        document.getElementById('message').textContent = "Invalid OTP.";
    }
});
