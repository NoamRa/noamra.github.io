import React from "react";
import { Icon } from "antd";
import contactList, { Contact } from "../../Conf/contacts";
import "./About.css";

const About: Reach.FC = (): JSX.Element => {
  return (
    <React.Fragment>
      <h4>About</h4>
      <p>
        <span className={"hidden-smile"}>
          Noam Raby, a robot that looks like a human, turned software developer 
        </span>
      </p>
      <p>
        <ol className={"contacts"}>{
          contactList.map((contact: Contact) => (
            <li>
              <a 
                href={contact.href}
                target="_blank" 
                rel="noreferrer noopener"
              >
                <Icon type={contact.icon}/>
                <span className={"contact-text"}>{contact.text}</span>
              </a>
            </li>
          ))
        }
        </ol>
      </p>
    </React.Fragment>
  )

};

export default About;