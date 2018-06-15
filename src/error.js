export default function error(messageKey) {
  const errorMessages = {
    documentation: 'Documentation: https://github.com/Marvin1003/react-lazily-img',
    message: {
      noChild: 'You forgot to pass a child. React Lazily IMG only works as wrapper.',
      altWarning: "Consider using an ALT-Text. It's important for SEO and accessibility",
      fallback: "Fallback - the non webp version is used even though this browser supports webp.",
      noWebpIMG: "You enabled WebP support. The Browser you are currently using also does but you didn't provide a webp image. Pass the webp version in the attribute: 'data-webpsrc'.",
      forgotPassIMG: "You probably forgot to pass the image."
    }
  };

  console.warn(`${errorMessages.message[messageKey]} ${errorMessages.documentation}`);
}