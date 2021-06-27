import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";


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
  const refPropertyValue = useRef(null);
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
          <h1 >Spring Application Properties</h1>
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
                return (
                  <tr class="d-flex flex-nowrap">
                    <td class="col-2 overflow-hidden">{propertySource.name}</td>
                    <td class="col-4 overflow-hidden">{property.name}</td>
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
