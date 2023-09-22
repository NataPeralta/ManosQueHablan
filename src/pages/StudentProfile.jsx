import {Textarea, ListItem, Text, Button, useDisclosure, Container, Input, Stack, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter, Heading, Box, StackDivider, List, SimpleGrid, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Center} from "@chakra-ui/react";
import {attendsOptions, accountsOptions, modalityOptions} from "../assets/variablesGlobals.jsx";
import EditPayment from "../components/EditPayment.jsx";
import DeletePayment from "../components/DeletePayment.jsx";
import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import "alertifyjs/build/css/alertify.css";
import PocketBase from "pocketbase";
import alertify from "alertifyjs";
import Select from "react-select";
import CreatePayment from "../components/CreatePayment.jsx";

const pb = new PocketBase("https://manos-que-hablan-db.onrender.com");

const UserProfile = () => {
  const {studentId} = useParams();
  const {isOpen: alertIsOpen, onOpen: alertOnOpen, onClose: alertOnClose} = useDisclosure();
  const {isOpen: drawerEditIsOpen, onOpen: drawerEditOnOpen, onClose: drawerEditOnClose} = useDisclosure();
  const [studentData, setStudentData] = useState(null);
  const [allPayments, setAllPayments] = useState([]);
  const cancelRef = React.useRef();
  const [changeStudentData, setChangeStudentData] = useState({
    name: "",
    document: "",
    direction: "",
    email: "",
    instagram: "",
    phone: "",
    attends: [],
    richtext: "",
  });



  const fetchData = async () => {
    const studentPayments = await pb.collection("payments").getFullList({filter: `person="${studentId}"`});
    setAllPayments(studentPayments);
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
  }, []);

  if (!studentData) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      <Container maxW={"7xl"}>
        {/* Student Info */}
        <SimpleGrid columns={{base: 1, lg: 2}} spacing={{base: 8, md: 10}} py={{base: 18, md: 24}}>
          <Stack spacing={{base: 6, md: 10}}>
            <Heading fontSize={{base: "2xl", sm: "4xl", lg: "5xl"}}>{studentData.name}</Heading>
            <Stack spacing={{base: 4, sm: 6}} direction={"column"} divider={<StackDivider />}>
              <Box>
                <Text fontSize={{base: "16px", lg: "18px"}} fontWeight={"500"} textTransform={"uppercase"} mb={"4"}>
                  Detalles del alumno:
                </Text>

                <List spacing={2}>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Documento:
                    </Text>
                    {studentData.document}
                  </ListItem>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Dirección:
                    </Text>
                    {studentData.direction}
                  </ListItem>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Email:
                    </Text>
                    {studentData.email}
                  </ListItem>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Instagram:
                    </Text>
                    {studentData.instagram}
                  </ListItem>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Teléfono:
                    </Text>
                    {studentData.phone}
                  </ListItem>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Cursos:
                    </Text>
                    {studentData.attends.map((attend) => (
                      <span key={attend}>{attend}</span>
                    ))}
                  </ListItem>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Comentarios:
                    </Text>
                    <Textarea
                      placeholder="Comentarios"
                      defaultValue={studentData.richtext}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setChangeStudentData({...changeStudentData, richtext: e.target.value});
                      }}
                    />
                  </ListItem>
                </List>
              </Box>
            </Stack>
          </Stack>
          <Stack direction={["column"]}>
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
          </Stack>
        </SimpleGrid>

        <CreatePayment studentData={studentData} studentId={studentId}/>

        <TableContainer id="paymentsProfile">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Dia de pago</Th>
                <Th>Monto</Th>
                <Th>Cuenta</Th>
                <Th>Concepto</Th>
                <Th>Modalidad</Th>
                <Th>Comprobante de Transferencia</Th>
                <Th>Factura</Th>
                <Th>Opciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {allPayments.map((payment) => (
                <Tr key={payment.id}>
                  <Td>
                    <Text>{payment.payday}</Text>
                  </Td>
                  <Td>
                    <Text>${payment.amount}</Text>
                  </Td>
                  <Td>
                    <Text>{payment.account}</Text>
                  </Td>
                  <Td>
                    <Text>{payment.concept}</Text>
                  </Td>
                  <Td>
                    <Text>{payment.modality}</Text>
                  </Td>
                  <Td>
                    <Text>{payment.billing}</Text>
                  </Td>
                  <Td>
                    <Text>{payment.invoice}</Text>
                  </Td>
                  <Td>
                    <Stack spacing={2} direction={{base: "row", md: "column"}} width={{base: "100%", md: "auto"}}>
                      <EditPayment payment={payment} />
                      <DeletePayment payment={payment} />
                    </Stack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        {/*Edit Student */}
        <Drawer size={"md"} isOpen={drawerEditIsOpen} placement="right" onClose={drawerEditOnClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              <Text>Editar Pago</Text>
            </DrawerHeader>

            <DrawerBody>
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
            </DrawerBody>

            <DrawerFooter>
              <Button colorScheme="green" mr={3} onClick={() => fetchDataSave(changeStudentData)}>
                Guardar
              </Button>
              <Button variant="outline" mr={3} onClick={drawerEditOnClose}>
                Cancel
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        {/*Delete Student */}
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
