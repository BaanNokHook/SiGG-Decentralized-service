import React from "react";
import PropTypes from "prop-types";
import styles from "./Panel.module.css";


export const PanelTitle = ({ children }) => (  
      <div className={styles.panelTitle}>{children}</div>
);  

PanelTitle.propTypes = {
  children: PropTypes.node.isRequired, 
};  

export const PanelBody = ({ icon, title, link, linkLabel, children }) => (   
      <div className={styles.panelBody}>
        <div className={styles.panelImageContainer}>   
            <img 
              src={icon}
              alt=""
              role="presentation"
              className={styles.panelImage}
            />       
        </div>  
        <div className={styles.panelMainContent}>
            <h3 className={styles.panelBodyTitle}>{title}</h3>   
            <p className={styles.panelBodyText}>{children}</p>
        </div>
        <div className={styles.panelButtonContainer}>  
            <a className={styles.panelLink} href={link}>
               {linkLabel}  
            </a> 
        </div>
      </div>
);  

PanelBody.protoTypes = {  
  icon: PropTypes.string,  
  title: PropTypes.node,  
  link: PropTypes.string,  
  linkLabel: PropTypes.node,  
  children: PropTypes.node.isRequired,  
};  

PanelBody.defaultProps = {  
  icon: "",  
  title: "",  
  link: "",  
  linkLabel: "",  
};  

export const Panel = ({ children }) => <div>{children}</div>;  

Panel.propTypes = {  
  children: PropTypes.node.isRequired,   
};  




