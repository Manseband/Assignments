var dark = false;

function switchTheme(img) {
    dark = !dark;
    if (dark) {
        img.src = "images/light.png";
        document.getElementById("navbar").style.backgroundColor = "black";
        var navdivs = document.getElementsByClassName("navdiv");
        for (var i = 0; i < navdivs.length; i++) {
            var current = navdivs[i];
            if (current.getAttribute("id") != "icondiv") { // Skip the border overwrite for the icondiv, we don't want a border for that element
                current.style.borderRight = "4px solid white";
            }
            current.firstElementChild.style.color = "white"; // Gets each hyperlink of each navdiv
        }
        document.getElementById("copyright").style.backgroundColor = "black";
        document.getElementById("copyright").style.color = "white";

        document.getElementById("modeicon").style.transform = "translateX(35px)";
    }
    else {
        img.src = "images/dark.png";
        document.getElementById("navbar").style.backgroundColor = "white";
        var navdivs = document.getElementsByClassName("navdiv");
        for (var i = 0; i < navdivs.length; i++) {
            var current = navdivs[i];
            if (current.getAttribute("id") != "icondiv") {
                current.style.borderRight = "4px solid black";
            }
            current.firstElementChild.style.color = "black"; // Gets each hyperlink of each navdiv
        }
        document.getElementById("copyright").style.backgroundColor = "white";
        document.getElementById("copyright").style.color = "black";

        document.getElementById("modeicon").style.transform = "translateX(0px)";
    }
}

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