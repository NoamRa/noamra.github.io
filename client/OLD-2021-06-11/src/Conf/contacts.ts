
export type Contact = {
  text: string,
  icon: string,
  href: string,
};

const contactList: Contact[] = [
  {
    text: "linkedin",
    icon: "linkedin",
    href: "https://www.linkedin.com/in/noamraby",
  },
  {
    text: "GitHub",
    icon: "github",
    href: "https://github.com/noamra",
  },
  {
    text: "noamraby@gmail.com",
    icon: "mail",
    href: "mailto:noamraby@gmail.com",
  },
];

export default contactList;