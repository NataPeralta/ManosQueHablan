/* eslint-disable no-useless-escape */
/* eslint-disable react/prop-types */
import {Text, Button, useDisclosure, Input, Stack, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter, Textarea} from "@chakra-ui/react";
import {attendsOptions} from "../assets/variablesGlobals.jsx";
import "alertifyjs/build/css/alertify.css";
import PocketBase from "pocketbase";
import alertify from "alertifyjs";
import Select from "react-select";
import {useState} from "react";

const pb = new PocketBase("http://127.0.0.1:8090");

const EditStudent = ({student}) => {
  const {isOpen: drawerEditIsOpen, onOpen: drawerEditOnOpen, onClose: drawerEditOnClose} = useDisclosure();
  const [editedStudent, setEditedStudent] = useState(student);

  const fetchDataSave = async (data) => {
    const dataSave = {
      ...data,
    };
    if (!/^\d+$/.test(dataSave.document)) {
      alertify.error("El número de teléfono no puede contener signos ni espacios");
      return;
    }
    if (!/^(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|)$/.test(dataSave.email)) {
      alertify.error("El campo email debe ser una dirección de correo electrónico válida");
      return;
    }
    if (!/^(?:https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)?)?$/.test(dataSave.instagram)) {
      alertify.error("El campo Instagram debe ser una URL válida o estar vacío");
      return;
    }
    if (!/^\d{10}$/g.test(dataSave.phone)) {
      alertify.error("Debe ingresar un número de teléfono válido de 10 dígitos");
      return;
    }
    const record = await pb.collection("students").update(dataSave.id, dataSave);
    console.log(record);
    drawerEditOnClose();
    alertify.success("Estudiante Actualizado");
  };

  return (
    <>
      <Button
        colorScheme="green"
        w={"full"}
        mt={8}
        py={"7"}
        _hover={{
          transform: "translateY(2px)",
          boxShadow: "lg",
        }}
        onClick={() => {
          drawerEditOnOpen();
        }}
      >
        Editar usuario
      </Button>
      {/*Edit Student */}
      <Drawer size={"md"} isOpen={drawerEditIsOpen} placement="right" onClose={drawerEditOnClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Text>Editar Estudiante</Text>
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing={3}>
              <Input
                size="md"
                placeholder="Nombre"
                value={editedStudent.name}
                onChange={(e) => {
                  setEditedStudent({...editedStudent, name: e.target.value});
                }}
              />
              <Input
                size="md"
                placeholder="Documento"
                value={editedStudent.document}
                onChange={(e) => {
                  setEditedStudent({...editedStudent, document: e.target.value});
                }}
              />
              <Input
                size="md"
                placeholder="Dirección"
                value={editedStudent.direction}
                onChange={(e) => {
                  setEditedStudent({...editedStudent, direction: e.target.value});
                }}
              />
              <Input
                size="md"
                placeholder="Email"
                value={editedStudent.email}
                onChange={(e) => {
                  setEditedStudent({...editedStudent, email: e.target.value});
                }}
              />
              <Input
                size="md"
                placeholder="Instagram"
                value={editedStudent.instagram}
                onChange={(e) => {
                  setEditedStudent({...editedStudent, instagram: e.target.value});
                }}
              />
              <Input
                size="md"
                placeholder="Teléfono"
                value={editedStudent.phone}
                onChange={(e) => {
                  setEditedStudent({...editedStudent, phone: e.target.value});
                }}
              />
              <Select
                options={attendsOptions}
                closeMenuOnSelect={false}
                isMulti
                defaultValue={editedStudent?.expand.courses.map((course) => ({value: course.id, label: course.name}))}
                onChange={(e) => {
                  setEditedStudent({...editedStudent, courses: e.map((attend) => attend.value)});
                }}
              />
              <Textarea
                placeholder="Comentarios"
                defaultValue={editedStudent.richtext}
                onChange={(e) => {
                  setEditedStudent({...editedStudent, richtext: e.target.value});
                }}
              />
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Button colorScheme="green" mr={3} onClick={() => fetchDataSave(editedStudent)}>
              Guardar
            </Button>
            <Button variant="outline" mr={3} onClick={drawerEditOnClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default EditStudent;
