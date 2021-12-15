import router from "next/router";
import React, { useState, useEffect, useContext } from "react";
import Loading from "../../../components/Loading";

const index = ({data}) => {

    const [submitted, setSubmitted] = useState()

    useEffect(() => {
        setTrade(data.trade)
        setWanted(data.wanted)
        setTradedescription(data.trade_description)
        setWanteddescription(data.wanted_description)
    }, [data])


    const handleChange = (event) => {
        setTrade(event.target.value)
    }

    const handleChange2 = (event) => {
        setWanted(event.target.value)
    }

    const handleChange3 = (event) => {
        setTradedescription(event.target.value)
    }
    
    const handleChange4 = (event) => {
        setWanteddescription(event.target.value)
    }

    const [trade, setTrade] = useState()
    const [wanted, setWanted] = useState()
    const [tradedescription, setTradedescription] = useState()
    const [wanteddescription, setWanteddescription] = useState()

    const [picture, setPicture] = useState(null);
    const [tradedimage, setTradedimage] = useState(null);

    const [picture2, setPicture2] = useState(null);
    const [wantedimage, setWantedimage] = useState(null);

    const onChangePicture = e => {
        if (e.target.files[0]) {
          setPicture(e.target.files[0]);
          const reader = new FileReader();
          reader.addEventListener("load", () => {
            setTradedimage(reader.result);
          });
          reader.readAsDataURL(e.target.files[0]);
        }
      };

    const onChangePicture2 = e => {
        if (e.target.files[0]) {
          setPicture2(e.target.files[0]);
          const reader = new FileReader();
          reader.addEventListener("load", () => {
            setWantedimage(reader.result);
          });
          reader.readAsDataURL(e.target.files[0]);
        }
      };

    const editPost = async (e) => {
        setSubmitted(true)
        e.preventDefault();
        const traded = document.getElementById('tradeimagepic');
        const wanted = document.getElementById('wantedimagepic');
        let formData = new FormData()
        if(traded.files[0]){
            formData.append("trade_image", traded.files[0])
        }
        if(wanted.files[0]){
            formData.append("wanted_image", wanted.files[0])
        }
        formData.append("trade", e.target.trade.value)
        formData.append("wanted", e.target.wanted.value)
        formData.append("trade_description", e.target.traddescription.value)
        formData.append("wanted_description", e.target.wanteddescription.value)
        const response = await fetch(`https://asiqursswap.herokuapp.com/api/updatepost/${data.id}/`, {
            // const response = await fetch('http://127.0.0.1:8000/api/createpost/', {
                method: "PATCH",
                body: formData
        })
        if(response.ok) {
            setSubmitted(false)
            router.push('/post/' + data.id)
        }
    }

    return (
        <div className="creatposttitle">
            {submitted &&
            <Loading />
            }
            <div>
                <h1 className="creatposttitleheader">Edit Post</h1>
            </div>
            <form className="postform" onSubmit={editPost}>
                <div className="postforminner">
                    <div>
                        <div className="posttitle">
                            <div>
                                <label>What do you have to trade?</label>
                                <br />
                                <input type="text" placeholder="e.g - PS5" name="trade" value={trade} onChange={handleChange} required/>
                            </div>
                            <div>
                                <label>What would you like to trade for?</label>
                                <br />
                                <input type="text" placeholder="e.g - Xbox Series X" name="wanted" value={wanted} onChange={handleChange2} required/>
                            </div>
                        </div>
                        <div className="postimages">
                            <div className="tradedimage">
                                <label>Change Image</label>
                                <br />
                                <input type="file"  accept="image/*" name="tradeimage" id="tradeimagepic" onChange={onChangePicture} />
                                <div className="previewProfilePic">
                                    <img src={tradedimage || data.trade_image}/>
                                </div>
                            </div>
                            <div className="wantedimage">
                            <label>Change Image</label>
                                <br />
                                <input type="file"  accept="image/*" name="wantedimage" id="wantedimagepic" onChange={onChangePicture2} />
                                <div className="previewProfilePic">
                                    <img src={wantedimage || data.wanted_image}/>
                                </div>
                                
                            </div>
                        </div>
                    </div>

                    <div className="postdescription">
                        <div>
                            <label>Description</label>
                            <p>Descripe what you have...</p>
                            <textarea id="tradedescription" name="traddescription" value={tradedescription} onChange={handleChange3} rows="4" cols="50" required/>
                        </div>
                        <div>
                            <label>Description</label>
                            <p>Descripe what you want</p>
                            <textarea id="tradedescription" name="wanteddescription" rows="4" value={wanteddescription} onChange={handleChange4} cols="50" required/>
                        </div>
                    </div>

                    <div className="postsubmit">
                        <input type="submit" value="Post" />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default index

export const getServerSideProps = async (context) => {
    const response = await fetch(`https://asiqursswap.herokuapp.com/api/post/${context.params.id}/`)
    const data = await response.json()
    return {
        props: {
            data
        }
    }
}