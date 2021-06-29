import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";


const propertyPrefixes = new Map([
  ["spring.cache", "application-properties.cache"],
  ["spring.gson", "application-properties.json"],
  ["spring.jackson", "application-properties.json"],
  ["spring.couchbase", "application-properties.data"],
  ["spring.data", "application-properties.data"],
  ["spring.datasource", "application-properties.data"],
  ["spring.h2", "application-properties.data"],
  ["spring.influx", "application-properties.data"],
  ["spring.jdbc", "application-properties.data"],
  ["spring.jooq", "application-properties.data"],
  ["spring.jpa", "application-properties.data"],
  ["spring.elasticsearch", "application-properties.data"],
  ["spring.ldap", "application-properties.data"],
  ["spring.mongodb", "application-properties.data"],
  ["spring.neao4j", "application-properties.data"],
  ["spring.r2dbc", "application-properties.data"],
  ["spring.redis", "application-properties.data"],
  ["spring.cache", "application-properties.cache"],
  ["spring.jta", "application-properties.transaction"],
  ["spring.flyway", "application-properties.data-migration"],
  ["spring.liquibase", "application-properties.data-migration"],
  ["spring.sql", "application-properties.data-migration"],
  ["spring.activemq", "application-properties.integration"],
  ["spring.artemis", "application-properties.integration"],
  ["spring.batch", "application-properties.integration"],
  ["spring.hazelcast", "application-properties.integration"],
  ["spring.integration", "application-properties.integration"],
  ["spring.jms", "application-properties.integration"],
  ["spring.kafka", "application-properties.integration"],
  ["spring.rabbitmq", "application-properties.integration"],
  ["spring.webservices", "application-properties.integration"],
  ["spring.hateoas", "application-properties.web"],
  ["spring.jersey", "application-properties.web"],
  ["spring.mvc", "application-properties.web"],
  ["spring.servlet", "application-properties.web"],
  ["spring.session", "application-properties.web"],
  ["spring.web", "application-properties.web"],
  ["spring.webflux", "application-properties.web"],
  ["spring.freemaker", "application-properties.templating"],
  ["spring.groovy", "application-properties.templating"],
  ["spring.mustache", "application-properties.templating"],
  ["spring.thymeleaf", "application-properties.templating"],
  ["server.", "application-properties.server"],
  ["spring.security", "application-properties.security"],
  ["spring.mail", "application-properties.mail"]]);


function isLinkedProperty(propertyName) {
  if (propertyName.startsWith("spring.")) {
    return true;
  }

  let isLinked = false;

  var BreakException = {};

  try {
    propertyPrefixes.forEach((v, k) => {
      if (propertyName.startsWith(k)) {
        isLinked = true;
        throw BreakException;
      }
    });
  } catch (e) {
    if (e !== BreakException) throw e;
  }

  return isLinked;
}

function getPropertyPrefix(propertyName) {
  const defaultPropertyAnchorPrefix = 'application-properties.core';

  let propertyPrefix = defaultPropertyAnchorPrefix;
  var BreakException = {};

  try {
    propertyPrefixes.forEach((v, k) => {
      if (propertyName.startsWith(k)) {
        propertyPrefix = v;
        throw BreakException;
      }
    });
  } catch (e) {
    if (e !== BreakException) throw e;
  }

  return propertyPrefix;
}


const PropertyValueModal = (props) => {
  const refPropertyValue = useRef(null);

  const copyToClipboard = () => {
    const propertyValue = refPropertyValue.current;
    propertyValue.select()
    document.execCommand("copy")
  }

  const property = props.property || {
    name: '',
    value: ''
  };
  return (
    <>
      <Modal show={props.show} size="lg" aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header>
          <Modal.Title>{property.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea ref={refPropertyValue} class="form-control" rows="20">
            {property.value}
          </textarea>
        </Modal.Body>
        <Modal.Footer>
          <button class="btn btn-secondary" onClick={() => copyToClipboard()}>
            Copy to Clipboard
          </button>
          <button class="btn btn-primary" onClick={props.handleClose}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function App() {
  const [properties, setProperties] = useState([]);
  const [property, setProperty] = useState(undefined);
  const handleClose = () => setProperty(undefined);

  useEffect(() => {
    fetch("./properties").then(res => res.json()).then((result) => {
      setProperties(result);
    })
  }, []);

  const showDetails = (property) => {
    setProperty(property);
  }

  function truncateString(str, num) {
    if (str.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  }

  function copyToClp(txt) {
    var m = document;
    txt = m.createTextNode(txt);
    var w = window;
    var b = m.body;
    b.appendChild(txt);
    if (b.createTextRange) {
      var d = b.createTextRange();
      d.moveToElementText(txt);
      d.select();
      m.execCommand('copy');
    }
    else {
      var d = m.createRange();
      var g = w.getSelection;
      d.selectNodeContents(txt);
      g().removeAllRanges();
      g().addRange(d);
      m.execCommand('copy');
      g().removeAllRanges();
    }
    txt.remove();
  }

  return (
    <div class="container">
      <div class="row mb-3">
        <div class="col">

          <div class="float-start">
            <h1 >Spring Application Properties</h1>
          </div>
          <div class="float-end h-100">
            <span class="helper"></span>
            <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html" rel="noreferrer" target="_blank"><img src="logo192.png" class="App-logo align-middle" alt="Spring Boot Logo" /></a>
          </div>
        </div>
      </div>
      <div class="">
        <table class="table table-striped table-bordered table-sm flex-nowrap">
          <thead>
            <tr class="d-flex">
              <th scope="col" class="col-2">Source</th>
              <th scope="col" class="col-4">Name</th>
              <th scope="col" class="col-4">Value</th>
              <th scope="col" class="col-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map(propertySource => (
              propertySource.properties.map(property => {
                const displayValue = truncateString(property.value, 50);
                const truncated = property.value !== displayValue;

                let propertyName;

                if (isLinkedProperty(property.name)) {
                  const propertyPrefix = getPropertyPrefix(property.name);

                  propertyName = (
                    <a href={"https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html#" + propertyPrefix + "." + property.name} target="_blank" rel="noreferrer">{property.name}</a>
                  )
                } else {
                  propertyName = property.name;
                }

                return (
                  <tr class="d-flex flex-nowrap">
                    <td class="col-2 overflow-hidden">{propertySource.name}</td>
                    <td class="col-4 overflow-hidden">{propertyName}</td>
                    <td class="col-4 overflow-hidden ">
                      <span class="d-inline-block text-truncate mw-350" >
                        {displayValue}
                      </span>

                    </td>
                    <td class="col-2 overflow-hidden ">
                      <div class="btn-group">
                        <button class="btn btn-primary" onClick={() => copyToClp(property.value)}>Copy</button>
                        {truncated ? <button class="btn btn-secondary" onClick={() => showDetails(property)}>More</button> : <></>}
                      </div>
                    </td>
                  </tr>
                )
              })

            ))}
          </tbody>
        </table>
      </div>
      <PropertyValueModal property={property} show={property !== undefined} handleClose={handleClose} />
    </div >
  );
}

export default App;
