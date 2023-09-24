import {Button, useDisclosure, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter} from "@chakra-ui/react";
import React from "react";
import "alertifyjs/build/css/alertify.css";
import PocketBase from "pocketbase";
import alertify from "alertifyjs";

const pb = new PocketBase("https://manos-que-hablan-db.onrender.com");

const DeleteStudent = (id) => {
  const {isOpen: alertIsOpen, onOpen: alertOnOpen, onClose: alertOnClose} = useDisclosure();
  const cancelRef = React.useRef();

  const deleteStudent = async (id) => {
    await pb.collection("students").delete(id);

    alertify.success("Estudiante Eliminado");

    setTimeout(() => {
      window.location.href = "/students";
    }, 1000);
  };
  return (
    <>
      <Button
        colorScheme="red"
        w={"full"}
        mt={8}
        py={"7"}
        _hover={{
          transform: "translateY(2px)",
          boxShadow: "lg",
        }}
        onClick={alertOnOpen}
      >
        Eliminar Usuario
      </Button>

      {/*Delete Student */}
      <AlertDialog motionPreset="slideInBottom" leastDestructiveRef={cancelRef} onClose={alertOnClose} isOpen={alertIsOpen} isCentered>
        <AlertDialogContent>
          <AlertDialogHeader>Estas segur@?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>Tene cuidado que si eliminas este usuario se van a eliminar todos los pagos asociados y tambien todos los datos del usuario, es un camino sin retorno.</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={alertOnClose}>
              Cancelar
            </Button>
            <Button colorScheme="red" ml={3} onClick={() => deleteStudent(id)}>
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteStudent;
