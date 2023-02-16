import React from 'react';
import styled from 'styled-components';

const ModalBackdrop = styled.div`
  display:          block;      /* Hidden by default */
  position:         fixed;     /* Stay in place */
  z-index:          1;         /* Sit on top */
  left:             0;
  top:              0;
  width:            100%;            /* Full width */
  height:           100%;            /* Full height */
  overflow:         auto;            /* Enable scroll if needed */
  background-color: rgb(0,0,0);      /* Fallback color */
  background-color: rgba(0,0,120,0.4); /* Black w/ opacity */
`;


const ModalContent = styled.div`
  background-color: #fefefe;
  margin:           15% auto; /* 15% from the top and centered */
  padding:          20px;
  border:           1px solid #888;
  width:            80%;
`;

const Close = styled.span` 

  @keyframes close_spin {
    from { transform: rotate(0deg)   }
    to   { transform: rotate(360deg) }
 }


  color:       #aaaaaa;
  float:       right;
  font-size:   28px;
  font-weight: bold;
  
  &:hover, &:focus {
    //animation: close_spin infinite 0.5s linear;
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }
`;

//        <Close>&times;</Close>

// implemented as a class solely for the sake of the React Ref, per documentation
export class Modal extends React.Component {

  setRef    = el  => this.modalElement=el;
  closeIt   = ()  => this.modalElement.style.display='none';
  nada      = evt => evt.stopPropagation();
  modalKeys = evt => {
    if(evt.keyCode === 27) {
      this.closeIt();
    }
  };

  componentDidMount() {
    document.addEventListener("keydown", this.modalKeys, false);
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.modalKeys, false);
  }


  render() {
   const {nada,closeIt,setRef} = this;
   const {content, outsideClose=false, close=nada, noClose=false} = this.props;

    return(
    <ModalBackdrop ref={setRef} onClick={outsideClose?()=>{closeIt();close()}:nada}>
      <ModalContent onClick={nada}>
        {noClose?null:<Close onClick={()=>{closeIt();close()}}>&times;</Close>}
        {content}
      </ModalContent>
    </ModalBackdrop>
    )
  }
}
