let last_active;
function openForm() {
    if (last_active.id !== "contact") {
        last_active = document.getElementsByClassName("active")[0];
        last_active.setAttribute("class", "");
        document.getElementById("contact").setAttribute("class", "active");
    }

    var popup = document.getElementById("contact_form");

    popup.style.display = "block";

    /*calc position of popup*/
    popup.style.left = (document.getElementById('bomberman').offsetWidth + document.getElementById('tutorial').offsetWidth) + "px";
    popup.style.top = document.getElementById('header').offsetHeight - 1 + "px";
}

function submitForm() {
    /*if we had a real server, we would send our input to the server here*/

    var contact_form = document.getElementById("contact_form");
    contact_form.style.opacity = 1;
    var fade_effect = setInterval(function () {
        if (contact_form.style.opacity > 0) {
            contact_form.style.opacity -= 0.02;
        } else {
            clearInterval(fade_effect);
            closeForm();


            /*show and fade out success message*/
            submit_success = document.getElementById("submit-success");

            submit_success.style.display = "flex";
            submit_success.style.opacity = 1;

            setTimeout(function () {
                fade_effect = setInterval(function () {
                    if (submit_success.style.opacity > 0) {
                        submit_success.style.opacity -= 0.01;
                    } else {
                        clearInterval(fade_effect);
                        submit_success.style.display = "none";
                    }
                }, 20);
            }, 2000);
        }
    }, 15);
}

function closeForm() {
    last_active.setAttribute("class", "active");
    document.getElementById("contact").setAttribute("class", "");

    document.getElementById("contact_form").style.display = "none";
    document.getElementById("contact_form").style.opacity = 1;
}

$(window).load(function(){
    //set playground to a 16:9 format
    let p_width = ($("#playground").height() * (16/9) / $( window ).width()) * 100;
    $("#playground").width( p_width + '%');


    $("#header").load("nav.html #nav-bar > *", function(){
        let active = document.getElementsByTagName("title")[0].innerText.toLowerCase();
        last_active = document.getElementById(active);
        last_active.setAttribute("class", "active");
    });
    $("#contact_form").load("contact.html #contact_form > *");
});