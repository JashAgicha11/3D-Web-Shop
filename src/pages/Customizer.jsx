import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSnapshot } from 'valtio'

import config from "../config/config";
import state from "../store";
import {download, logoShirt, stylishShirt} from '../assets'
import { downloadCanvasToImage , reader} from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';

import { fadeAnimation, slideAnimation } from '../config/motion';
import {AIPicker , ColorPicker, CustomButton, FilePicker, Tab} from "../components";

const Customizer = () => {
  const snap = useSnapshot(state)
  const [file, setFile] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatingImg, setGeneratingImg] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt:false,
    stylishShirt:false
  });

  const generateTabContent = () =>{
      switch (activeEditorTab) {
        case "colorpicker":
          return <ColorPicker />
        case "filepicker":
          return <FilePicker 
          file={file}
          setFile = {setFile}
          readFile = {readFile}
          />
        case "aipicker":
          return <AIPicker 
          prompt = {prompt}
          setPrompt = {setPrompt}
          generatingImg = {generatingImg}
          handleSubmit = {handleSubmit}
          />
      
        default:
          return null ;
      }
  }

  const handleSubmit = async(type) =>{
    if(!prompt) return alert(" Please enter a prompt");

    try {
      
    } catch (error) {
      alert(error)
    }finally{
      setGeneratingImg(false)
      setActiveEditorTab("")
    }
  }




  const handleDecals = (type,result) =>{
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = result;

    if(!activeFilterTab[decalType.flterTab]){
      handleActiveFilterTab(decalType.filterTab)
    }
  
  }

  const handleActiveFilterTab = (tabName)=>{
    switch (tabName) {
      case "logoShirt":
          state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
          state.isFullTexture = !activeFilterTab[tabName];
        break ;
    
      default:
        state.isFullTexture = false;
        state.isLogoTexture = true; 
    }

    setActiveFilterTab((prevState) => {
      return{
        ...prevState,
        [tabName] : !prevState[tabName]
      }
    })
  }

  const readFile = (type) =>{
    reader(file)
    .then((result)=>{
      handleDecals(type,result);
      setActiveEditorTab("")
    })
  }


  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
           key="custom"
           className='absolute top-0 left-0 z-10 '
           {...slideAnimation('left')}
          >
            <div className='flex items-center min-h-screen'>
              <div className='editortabs-container tabs'> 
                  {EditorTabs.map((tab) =>(
                    <Tab 
                    key={tab.name}
                    tab ={tab}
                    handleClick={()=> setActiveEditorTab(tab.name)}
                    />
                  ))}

<button className='download-btn' onClick={downloadCanvasToImage}>
                <img
                  src={download}
                  alt='download_image'
                  className='w-4/5 h-4/5 object-contain'
                />
              </button>

                  {generateTabContent()}
              </div>
            </div>

          </motion.div>
          <motion.div 
          className='absolute x-10 top-5 right-5' 
          {...fadeAnimation}
          >
            <CustomButton 
            type="filled"
            title = "Go back"
            handleClick={()=> state.intro = true}
            customStyles="w-fit px-4 p-2.5 font-bold text-sm"
            />

          </motion.div>

          <motion.div className='download-btn' {...slideAnimation('up')}>
           
          </motion.div>

          <motion.div
          className='filtertabs-container'
          {...slideAnimation('up')}
          >
            {FilterTabs.map((tab) => (
                    <Tab 
                    key={tab.name}
                    tab ={tab}
                    isFilterTab
                    isActiveTab= {activeFilterTab[tab.name]}
                    handleClick={()=>handleActiveFilterTab(tab.name)}
                    />
                  ))}
          </motion.div>
          
        </>
      ) }
    </AnimatePresence>
  )
}
export default Customizer

