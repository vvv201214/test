import React, { useEffect, useState } from 'react';
import axios from 'axios';


const FileUploader = () => {


  const [detail, setDetails] = useState({
    name: "",
    discription: "",
    price: "",
    currency: ""
  })
  const [file, setFile] = useState(null);
  const [uploadedData, setUploadedData] = useState([]);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:8080/"

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/data`)
    .then((resp)=>{
      setUploadedData(resp.data.data);
    }).catch((err)=>{
      console.log(err);
    })
  }, [file])

  const handleFileChange = (event) => {
    setFile(event.target.files);
  };


  const handleUpload = async () => {
    setDetails(detail);
    console.log(detail)
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    if(file.length > 6){
      alert('Upto 6 files allowed');
      return;
    }
  
    try {
      const formData = new FormData();
      for (let i = 0; i < file.length; i++) {
        formData.append("files", file[i]);
      }
      formData.append('name', detail.name);
      formData.append('description', detail.discription);
      formData.append('price', detail.price);
      formData.append('currency', detail.currency);

      console.log(formData, file, file.name)
      const { data } = await axios.post(`${baseUrl}api/v1/uploads`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
  
      console.log("if file uploaded before", data);
      alert("File upload successfully");
      console.log("if file uploaded", data);
      setFile(null)
    } catch (error) {
      console.log(error, file);
      alert('File upload failed');
    }
  };



  return (
    <>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '50%', marginBottom: '10px' }}>
            <label style={{ fontWeight: 'bold' }} htmlFor="name">Name:</label>
            <input id="name" type="text" style={{ width: '100%', padding: '5px' }} onChange={(e) => { detail.name = e.target.value }} />
          </div>
          <div style={{ width: '50%', marginBottom: '10px' }}>
            <label style={{ fontWeight: 'bold' }} htmlFor="description">Description:</label>
            <input id="description" type="text" style={{ width: '100%', padding: '5px' }} onChange={(e) => { detail.discription = e.target.value }} />
          </div>
          <div style={{ width: '50%', marginBottom: '10px' }}>
            <label style={{ fontWeight: 'bold' }} htmlFor="price">Price:</label>
            <input id="price" type="text" style={{ width: '100%', padding: '5px' }} onChange={(e) => { detail.price = e.target.value }} />
          </div>
          <div style={{ width: '50%', marginBottom: '10px' }}>
            <label style={{ fontWeight: 'bold' }} htmlFor="currency">Select a currency:</label>
            <select id="currency" name="currency" style={{ width: '100%', padding: '5px' }} onChange={(e) => { detail.currency = e.target.value }}>
              <option value="USD">Select</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
            </select>
          </div>
          <div style={{ width: '50%', marginBottom: '10px' }}>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ padding: '5px' }}
            />
          </div>
          <div style={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
            <button onClick={handleUpload} style={{ padding: '10px 20px', backgroundColor: 'red', color: 'white', fontWeight: 'bold' }}>
              Submit
            </button>
          </div>

          <div style={{ width: '50%', marginBottom: '10px', marginTop: '20px', fontWeight: 'bold' }}>
            Uploaded Image will apear here
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {uploadedData.map((elem, index) => {
              console.log(elem.link, elem)
              return (
              <div key={`image-${index+1}`}>
                <img src={elem?.link} alt="Image" style={{ maxWidth: '60%', height: '60%' }} />
                <div style={{ fontWeight: 'bold' }}>{`${elem.name}`}</div>
              </div>
            )})}
          </div>

        </div>

        
    </>
  );
};

export default FileUploader;