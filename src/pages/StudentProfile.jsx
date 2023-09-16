import React, {useState, useEffect} from "react";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import {useParams} from "react-router-dom";
import PocketBase from "pocketbase";
import Select from "react-select";
import {Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,Textarea , UnorderedList, ListItem, Text, ModalBody, ModalCloseButton, Button, useDisclosure, Container, Input, Stack, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter} from "@chakra-ui/react";

const pb = new PocketBase("https://manos-que-hablan-db.onrender.com");

const UserProfile = () => {
  const {isOpen: alertIsOpen, onOpen: alertOnOpen, onClose: alertOnClose} = useDisclosure();
  const cancelRef = React.useRef();
  const [studentData, setStudentData] = useState(null);
  const {isOpen: modalIsOpen, onOpen: modalOnOpen, onClose: modalOnClose} = useDisclosure();
  const [changeStudentData, setChangeStudentData] = useState();
  const attendsList = ["Mar23-N1", "Mar23-N2", "Mar23-N3", "Mar23-N4", "Mar23-N5", "Mar23-N6", "Ago23-N1", "Ago23-N2", "Ago23-N3", "Ago23-N4", "Ago23-N5", "Ago23-N6", "Mar22-N1", "Mar22-N2", "Mar22-N3", "Mar22-N4", "Mar22-N5", "Mar22-N6", "Ago22-N1", "Ago22-N2", "Ago22-N3", "Ago22-N4", "Ago22-N5", "Ago22-N6", "Mar21-N1", "Mar21-N2", "Mar21-N3", "Mar21-N4", "Mar21-N5", "Mar21-N6", "Ago21-N1", "Ago21-N2", "Ago21-N3", "Ago21-N4", "Ago21-N5", "Ago21-N6", "Mar20-N1", "Mar20-N2", "Mar20-N3", "Mar20-N4", "Mar20-N5", "Mar20-N6", "Ago20-N1", "Ago20-N2", "Ago20-N3", "Ago20-N4", "Ago20-N5", "Ago20-N6", "Mar19-N1", "Mar19-N2", "Mar19-N3", "Mar19-N4", "Mar19-N5", "Mar19-N6", "Ago19-N1", "Ago19-N2", "Ago19-N3", "Ago19-N4", "Ago19-N5", "Ago19-N6"];

  const attendsOptions = attendsList.map((attend) => ({
    value: attend,
    label: attend,
  }));

  const {studentId} = useParams();

  const fetchData = async () => {
    // const listStudentById_payment = await pb.collection("payments").getFullList({filter: `person="${userId}"`});

    const record = await pb.collection("students").getOne(studentId);
    setStudentData(record);
    setChangeStudentData(record);
  };

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
    alertify.success("Estudiante Actualizado");
  };
  const deleteStudent = async (id) => {
    await pb.collection("students").delete(id);

    alertify.success("Estudiante Eliminado");

    setTimeout(() => {
      window.location.href = "/students";
    }, 1000);
  };

  useEffect(() => {
    fetchData();
  }, [studentId]);

  if (!studentData) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      <Modal isOpen={modalIsOpen} onClose={modalOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <Input
                size="md"
                onChange={(e) => {
                  setChangeStudentData({...changeStudentData, name: e.target.value});
                }}
                placeholder="Nombre"
                value={changeStudentData.name}
              />

              <Input
                placeholder="Documento"
                size="md"
                onChange={(e) => {
                  setChangeStudentData({...changeStudentData, document: e.target.value});
                }}
                value={changeStudentData.document}
              />
              <Input
                size="md"
                onChange={(e) => {
                  setChangeStudentData({...changeStudentData, direction: e.target.value});
                }}
                placeholder="Dirección"
                value={changeStudentData.direction}
              />
              <Input
                size="md"
                onChange={(e) => {
                  setChangeStudentData({...changeStudentData, email: e.target.value});
                }}
                placeholder="Email"
                value={changeStudentData.email}
              />
              <Input
                size="md"
                onChange={(e) => {
                  setChangeStudentData({...changeStudentData, instagram: e.target.value});
                }}
                placeholder="Instagram"
                value={changeStudentData.instagram}
              />
              <Input
                size="md"
                onChange={(e) => {
                  setChangeStudentData({...changeStudentData, phone: e.target.value});
                }}
                placeholder="Teléfono"
                value={changeStudentData.phone}
              />
              <Select
                options={attendsOptions}
                closeMenuOnSelect={false}
                isMulti
                defaultValue={changeStudentData.attends.map((attend) => ({value: attend, label: attend}))}
                onChange={(e) => {
                  setChangeStudentData({...changeStudentData, attends: e.map((attend) => attend.value)});
                }}
              />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => fetchDataSave(changeStudentData)}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Container>
        <Stack spacing={3}>
          <Text fontSize="lg">Nombre: {studentData.name}</Text>
          <Text fontSize="lg">Documento: {studentData.document}</Text>
          <Text fontSize="lg">Dirección: {studentData.direction}</Text>
          <Text fontSize="lg">Email: {studentData.email}</Text>
          <Text fontSize="lg">Instagram: {studentData.instagram}</Text>
          <Text fontSize="lg">Teléfono: {studentData.phone}</Text>
          <Textarea placeholder="Comentarios" value={studentData.richtext} />
          <UnorderedList>
            <Text fontSize="lg">Cursos:</Text>
            {studentData.attends.map((attend) => (
              <ListItem key={attend}>{attend}</ListItem>
            ))}
          </UnorderedList>
        </Stack>
        <Button onClick={modalOnOpen}>Editar Usuario</Button>
        <Button onClick={alertOnOpen}>Eliminar Usuario</Button>

        <AlertDialog motionPreset="slideInBottom" leastDestructiveRef={cancelRef} onClose={alertOnClose} isOpen={alertIsOpen} isCentered>
          <AlertDialogContent>
            <AlertDialogHeader>Estas segur@?</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>Tene cuidado que si lo eliminas se van a eliminar todos los pagos asociados y tambien todos los datos del usuario, es un camino sin retorno.</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={alertOnClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" ml={3} onClick={() => deleteStudent(studentData.id)}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Container>
    </>
  );
};

export default UserProfile;
