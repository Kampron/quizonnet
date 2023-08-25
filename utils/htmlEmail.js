export function html({ url, text }) {
  return `
  <div
      className="max-w-2xl m-auto border-8  border-solid border-gray-200 px-12 py-5 text-[110%]"
    >
      <h2 style="text-align: center; text-transform: capitalize; color: teal">
        Welcome to Quizonnet
      </h2>
      <p>
        Congratulations! You'are almost set to start using the application. Just
        click the button below to validate your email address.
      </p>

      <a
        href=${url}
        style="
          background: crimson;
          text-decoration: none;
          color: white;
          padding: 10px 20px;
          margin: 10px, 0;
          display: inline-block;
        "
      >
        ${text}</a
      >
      <p>if the button doesn't work for any reason, you can also click on the link below</p>
      <div>${url}</div>
    </div>`;
}
