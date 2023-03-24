import axios from "axios";
export function sendMail(html, subject, recipient) {
  axios({
    method: "POST",
    url: `${process.env.REACT_APP_SERVER_URL}/user/send_mail`,
    data: { HTMLContent: html, subject: subject, recipient: recipient },
    headers: {
      "content-type": "application/json",
      "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
    },
  })
    .then((response) => {
      console.log("mail sent to ", recipient);
    })
    .catch((err) => {
      console.log(err);
    });
}
