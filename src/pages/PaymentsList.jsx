import alertify from "alertifyjs";
import Select from "react-select";
import PocketBase from "pocketbase";
import {Link} from "react-router-dom";
import "alertifyjs/build/css/alertify.css";
import React, {useState, useEffect} from "react";
import {Center, Heading, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useDisclosure, Input, Stack, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter} from "@chakra-ui/react";

const pb = new PocketBase("https://manos-que-hablan-db.onrender.com");

const PaymentsList = () => {
  const [allPayments, setAllPayments] = useState([]);
  const {isOpen: alertIsOpen, onOpen: alertOnOpen, onClose: alertOnClose} = useDisclosure();
  const cancelRef = React.useRef();
  const [paymentData, setPaymentData] = useState(null);
  const {isOpen: modalIsOpen, onOpen: modalOnOpen, onClose: modalOnClose} = useDisclosure();
  const [changePaymentData, setChangePaymentData] = useState({});

  const modalityList = ["Asincronico", "Sincronico"];
  const modalityOptions = modalityList.map((attend) => ({
    value: attend,
    label: attend,
  }));

  const cuentasUnicas = ["MP Instituto", "Bco Sonia", "MP Facu", "MP Sonia", "Bco Facu", "Dani"];
  const accountsOptions = cuentasUnicas.map((attend) => ({
    value: attend,
    label: attend,
  }));

  const showData = async () => {
      const listPayments = await pb.collection("payments").getFullList();
      const listStudents = await pb.collection("students").getFullList();

      const mapListStudents = new Map(listStudents.map((student) => [student.id, student]));
      const listPaymentsFormat = listPayments.map((payment) => ({
        ...payment,
        payday: new Date(payment.payday).toLocaleDateString("es-AR", {year: "2-digit", month: "2-digit", day: "2-digit"}),
      }));
      const listPaymentsWithUsers = listPaymentsFormat.map((payment) => {
        const student = mapListStudents.get(payment.person);
        return student ? {...payment, personId: student.id, personName: student.name} : payment;
      });
      setAllPayments(listPaymentsWithUsers);
  };

  const fetchDataSave = async (data) => {
    const dataSave = {
      ...data,
    };

    const record = await pb.collection("payments").update(dataSave.id, dataSave);
    console.log(record);
    alertify.success("Pago Actualizado");
  };

  const deleteStudent = async (id) => {
        const record = await pb.collection("payment").delete(id);
    console.log(record);
    alertify.success("Pago Eliminado");
  };

  useEffect(() => {
    showData();
  }, []);

  return (
    <div className="App">
      <Center>
        <Heading as="h1" size="2xl">
          Pagos
        </Heading>
      </Center>

      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Dia de pago</Th>
              <Th>Estudiante</Th>
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
                  <Link to={`/students/${payment.personId}`}>{payment.personName}</Link>
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
                  <Button
                    onClick={() => {
                      setChangePaymentData(payment);
                      modalOnOpen();
                    }}
                  >
                    Editar pago
                  </Button>
                  <Button onClick={alertOnOpen}>Eliminar pago</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal isOpen={modalIsOpen} onClose={modalOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <Input size="md" placeholder="Nombre" value={changePaymentData.payday} />
              <Select
                options={modalityOptions}
                closeMenuOnSelect={false}
                defaultValue={changePaymentData.modality}
                isSearchable={false}
                onChange={(e) => {
                  setChangePaymentData({...changePaymentData, modality: e.value});
                }}
              />
              <Select
                options={accountsOptions}
                closeMenuOnSelect={false}
                defaultValue={changePaymentData.account}
                isSearchable={false}
                onChange={(e) => {
                  setChangePaymentData({...changePaymentData, account: e.value});
                }}
              />
              <Input size="md" placeholder="Monto" value={changePaymentData.amount} />
              <Input size="md" placeholder="Concepto" value={changePaymentData.concept} />
              <Input size="md" placeholder="Comprobante de Transferencia" value={changePaymentData.billing} />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => fetchDataSave(changePaymentData)}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog motionPreset="slideInBottom" leastDestructiveRef={cancelRef} onClose={alertOnClose} isOpen={alertIsOpen} isCentered>
        <AlertDialogContent>
          <AlertDialogHeader>Estas segur@?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>Tene cuidado que si lo eliminas se van a eliminar todos los pagos asociados y tambien todos los datos del usuario, es un camino sin retorno.</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={(alertOnClose, setPaymentData)}>
              Cancelar
            </Button>
            <Button colorScheme="red" ml={3} onClick={() => {console.log(changePaymentData);
              deleteStudent(paymentData.id)}}>
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PaymentsList;
