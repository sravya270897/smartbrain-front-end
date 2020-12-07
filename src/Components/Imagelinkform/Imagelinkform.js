import React from 'react';
import './Imagelinkform.css';


const Imagelinkform = ({onInputChange,onButtonSubmit}) => {
	return (
		<div>
		   <p className='f3'> 
              {'Let\'s detect your faces in the image!'}
            </p>
            <div className = 'center'>
              <div className = 'form center pa4 br3 shadow-5 '>
               <input className='f5 pa2 w-80 center' type='text' onChange={onInputChange}/>
               <button className='w-20 grow f5 link ph3 pv2 dib black bg-light-black center'
                onClick={onButtonSubmit}>
                Detect</button>
	          </div>
	        </div> 
	    </div>
	);
}
export default Imagelinkform;