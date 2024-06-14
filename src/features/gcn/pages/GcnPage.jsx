import React, { useEffect, useState } from 'react';
import GcnModal from '../components/GcnModal';
import { Button } from 'react-bootstrap';
import template from '../template/template1';

function GcnPage() {
  const [show, setShow] = useState(false);
  const [gcn, setGcn] = useState(template);
  const [width, setWidth] = useState(1122);
  const [height, setHeight] = useState(793);

  useEffect(() => {
    document.querySelector('svg').style.display = 'none';
  }, [gcn]);

  const download = () => {
    let svg = document.querySelector('svg');
    var canvas = document.getElementById('c');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    canvas.width = width;
    canvas.height = height;
    var data = new XMLSerializer().serializeToString(svg);
    var win = window.URL || window.webkitURL || window;
    var img = new Image();
    var blob = new Blob([data], { type: 'image/svg+xml' });
    var url = win.createObjectURL(blob);
    img.onload = function () {
      canvas.getContext('2d').drawImage(img, 0, 0);
      win.revokeObjectURL(url);
      var uri = canvas
        .toDataURL('image/png')
        .replace('image/png', 'octet/stream');
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      a.href = uri;
      a.download =
        'GCN-' +
        new Date().toLocaleDateString() +
        '-' +
        new Date().toLocaleTimeString() +
        '.png';
      a.click();
      window.URL.revokeObjectURL(uri);
      document.body.removeChild(a);
    };
    img.src = url;
  };
  return (
    <div className='d-flex flex-column align-items-center'>
      <Button variant='success' className='my-3' onClick={() => setShow(true)}>
        Nhập thông tin
      </Button>
      <Button variant='outline-success' className='mb-3' onClick={download}>
        Tải xuống
      </Button>
      <img src={`data:image/svg+xml;utf8,${encodeURIComponent(gcn)}`} width={'100%'} />
      <GcnModal
        show={show}
        setShow={setShow}
        setInfo={({ name, school }) => {
          setGcn(
            gcn
              .replace('{{name}}', name?.toUpperCase())
              .replace('{{school}}', school?.toUpperCase())
          );
        }}
      />
      <div
        dangerouslySetInnerHTML={{ __html: gcn }}
        className='d-flex justify-content-center align-items-center'
      />
      <div visibility='hidden' id='d'></div>
      <canvas
        style={{
          visibility: 'hidden',
        }}
        id='c'
      ></canvas>
    </div>
  );
}

export default GcnPage;
