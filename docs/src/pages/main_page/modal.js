
import React, { useEffect, useRef, useContext } from 'react';
import ModifyButton from "../../components/modal/ModifyButton.js";
import DeleteButton from "../../components/modal/DeleteButton.js";
import { OpenModal, OpenModalContent } from "../../styles/modal/opened_modal.js";
import { ModalContext } from '../../contexts/modal_context.js';

const Modal = () => {
  const {closeModal, modalTodo} = useContext(ModalContext);

  const modalRef = useRef(null);

  useEffect(()=>{
    if(!modalRef.current) return;
    setTimeout(()=>{
      modalRef.current.style.transform = "translate(-50%,0)";
      modalRef.current.style.opacity = "1";
    },10);
  },[modalRef]);

  return (
    <>
      <OpenModal>
        <OpenModalContent ref={modalRef}>
        <div id="close">
            <div className="close" onClick={closeModal(modalRef)}>&times;</div>
          </div>
          <div id="todo-title">{modalTodo.todoTitle}</div>
          <div className="btns">
              <ModifyButton modalRef={modalRef}/>
              <DeleteButton modalRef={modalRef}/>
          </div>
        </OpenModalContent>
      </OpenModal>
    </>
  );
};

export default Modal