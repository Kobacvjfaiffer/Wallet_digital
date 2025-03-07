const logged = sessionStorage.getItem("auth")

if(!logged)
    location.href = "./../login.html"
