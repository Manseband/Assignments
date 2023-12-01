function submitTestimonial() {
    window.alert("Thank you!")
    emailjs.init("gBlS97W9mCMXx6qRf");
    event.preventDefault();
    var testimonial = document.getElementById('testimonial-2').value;
    var name = document.getElementById('name-2').value;
    var affiliation = document.getElementById('affiliation-2').value;

    // Prepare email parameters
    var emailParams = {
        to_email: "rishibhunji@gmail.com",  
        from_name: name,
        affiliation: affiliation,
        user_testimonial: testimonial
    };

    emailjs.send("default_service", "template_j346pnj", emailParams)
        .then(function(response) {
            console.log("Email sent successfully", response);
            var submittedTestimonials = document.getElementById('submittedTestimonials');
            var newTestimonial = document.createElement('div');
            newTestimonial.innerHTML = '<p><strong>Name:</strong> ' + name + '</p>' +
                                       '<p><strong>Affiliation:</strong> ' + affiliation + '</p>' +
                                       '<p><strong>Testimonial:</strong> ' + testimonial + '</p>';
            submittedTestimonials.appendChild(newTestimonial);

            document.getElementById('testimonial-2').value = '';
            document.getElementById('name-2').value = '';
            document.getElementById('affiliation-2').value = '';
        })
        .catch(function(error) {
            console.error("Error sending email", error);
        });
}