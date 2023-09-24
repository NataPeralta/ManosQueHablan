/* eslint-disable react/prop-types */
import {Button, useDisclosure, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter} from "@chakra-ui/react";
import "alertifyjs/build/css/alertify.css";
import {BsTrash} from "react-icons/bs";
import PocketBase from "pocketbase";
import alertify from "alertifyjs";
import React from "react";

const pb = new PocketBase("http://127.0.0.1:8090");

const DeletePayment = ({payment}) => {
  const {isOpen: alertIsOpen, onOpen: alertOnOpen, onClose: alertOnClose} = useDisclosure();

  const cancelRef = React.useRef();

  const deletePayment = async (id) => {
    const record = await pb.collection("payments").delete(id);
    console.log(record);
    alertify.success("Pago Eliminado");
  };

  return (
    <>
      <Button
        width={{base: "100%", md: "auto"}}
        colorScheme="red"
        onClick={() => {
          alertOnOpen();
        }}
      >
        <BsTrash />
      </Button>

      {/* Delete Payment */}
      <AlertDialog motionPreset="slideInBottom" leastDestructiveRef={cancelRef} onClose={alertOnClose} isOpen={alertIsOpen} isCentered>
        <AlertDialogContent>
          <AlertDialogHeader>Estás seguro?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>Ten cuidado, si eliminas este pago, también se eliminarán todos los pagos asociados y los datos del usuario, este proceso no se puede deshacer.</AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => {
                alertOnClose();
              }}
            >
              Cancelar
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={() => {
                deletePayment(payment.id);
                alertOnClose();
              }}
            >
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeletePayment;
