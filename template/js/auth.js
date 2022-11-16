const registerAction = async () => {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  let data = {
    username: username,
    password: password,
  };

  const response = await fetch("http://localhost:8080/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify(data),
  });

  const myJson = await response.json();

  if (myJson.error === undefined) {
    pushNotify("success", myJson.username, myJson.message);
  } else {
    pushNotify("error", "Error", myJson.error);
  }
};

const loginAction = async () => {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  let data = {
    username: username,
    password: password,
  };

  const response = await fetch("http://localhost:8080/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify(data),
  });

  const myJson = await response.json();

  if (myJson.error === undefined) {
    pushNotify("success", myJson.username, myJson.message);
    window.location.href = "/page/dashboard";
  } else {
    pushNotify("error", "Error", myJson.error);
  }
};

function pushNotify(status, title, message) {
  new Notify({
    status: status,
    title: title,
    text: message,
    effect: "fade",
    speed: 300,
    customClass: null,
    customIcon: null,
    showIcon: true,
    showCloseButton: true,
    autoclose: true,
    autotimeout: 3000,
    gap: 20,
    distance: 20,
    type: 1,
    position: "right top",
  });
}
