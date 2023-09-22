import alertify from "alertifyjs";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import PocketBase from "pocketbase";
import {Link} from "react-router-dom";
import "alertifyjs/build/css/alertify.css";
import React, {useState, useEffect} from "react";
import {AiOutlineEdit} from "react-icons/ai";
import { BsTrash} from "react-icons/bs";
import { accountsOptions, modalityOptions} from "../assets/variablesGlobals.jsx";
import {Center, Heading, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, Button, useDisclosure, Input, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Stack} from "@chakra-ui/react";

const pb = new PocketBase("https://manos-que-hablan-db.onrender.com");

const PaymentsList = () => {
  const {isOpen: alertIsOpen, onOpen: alertOnOpen, onClose: alertOnClose} = useDisclosure();
  const {isOpen: drawerEditIsOpen, onOpen: drawerEditOnOpen, onClose: drawerEditOnClose} = useDisclosure();
  const {isOpen: drawerCreateIsOpen, onOpen: drawerCreateOnOpen, onClose: drawerCreateOnClose} = useDisclosure();
  const [changePaymentData, setChangePaymentData] = useState({});
  const [inputValues, setInputValues] = useState({
    payday: "",
    person: "",
    amount: "",
    account: "",
    concept: "",
    modality: "",
    billing: "",
    invoice: "",
  });
  const [paymentData, setPaymentData] = useState(null);
  const [allPayments, setAllPayments] = useState([]);
  const cancelRef = React.useRef();
  const btnRef = React.useRef();

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


  const studentsOptions = async (inputValue) => {
    try {
      const students = await pb.collection("students").getFullList();
      const filteredStudents = students.filter((student) => student.name.toLowerCase().includes(inputValue.toLowerCase()));

      const options = filteredStudents.map((student) => ({
        label: student.name,
        value: student.id,
      }));
      console.log(options);
      return options;
    } catch (error) {
      console.error("Error al obtener opciones de estudiantes:", error);
      return [];
    }
  };

  const createNewPayment = async (paymentData) => {
    if (!paymentData.personId) {
      return alertify.error("El campo 'Alumno' es obligatorio");
    }
    if (!paymentData.account) {
      return alertify.error("El campo 'Cuenta' es obligatorio");
    }
    if (!paymentData.amount) {
      return alertify.error("El campo 'Monto' es obligatorio");
    }
    if (isNaN(Number(paymentData.amount))) {
      return alertify.error("El valor de 'Monto' debe ser un número válido");
    }

    if (paymentData.id) {
      return alertify.error("La modalidad debe ser Sincronica, Asincronica o estar vacia");
    }

    try {
      const createdPayment = await pb.collection("payments").create(paymentData);
      console.log("Pago creado:", createdPayment);
      drawerCreateOnClose();
      alertify.success("Pago Creado");
    } catch (error) {
      console.error("Error al crear el pago:", error);
      alertify.error("Error al crear el pago");
    }
  };

  const updatePayment = async (data) => {
    const dataSave = {
      ...data,
    };

    const record = await pb.collection("payments").update(dataSave.id, dataSave);
    console.log(record);
    alertify.success("Pago Actualizado");
  };

  const deletePayment = async (id) => {
    const record = await pb.collection("payments").delete(id); // Cambiado de "payment" a "payments"
    console.log(record);
    alertify.success("Pago Eliminado");
  };

  useEffect(() => {
    showData();
  }, [allPayments]);

  return (
    <div className="App">
      <Center>
        <Heading as="h1" size="2xl">
          Pagos
        </Heading>
      </Center>

      {/*Create Payment */}
      <Button
        onClick={() => {
          drawerCreateOnOpen();
        }}
      >
        Crear pago
      </Button>

      {/*Create Payment */}
      <Drawer size={"md"} isOpen={drawerCreateIsOpen} placement="right" onClose={drawerCreateOnClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Crear pago</DrawerHeader>

          <DrawerBody>
            <Stack spacing={3}>
              <AsyncSelect
                cacheOptions
                defaultOptions
                placeholder="Buscar alumno..."
                loadOptions={studentsOptions}
                onChange={(e) => {
                  console.log({...inputValues, person: e.value});
                  setInputValues({...inputValues, person: e.value});
                }}
              />

              <Select
                options={modalityOptions}
                placeholder="Modalidad"
                defaultValue={changePaymentData.modality}
                isSearchable={false}
                onChange={(e) => {
                  setInputValues({...inputValues, modality: e.value});
                }}
              />
              <Select
                options={accountsOptions}
                placeholder="Cuenta"
                defaultValue={changePaymentData.account}
                isSearchable={false}
                onChange={(e) => {
                  setInputValues({...inputValues, account: e.value});
                }}
              />
              <Input
                size="md"
                placeholder="Monto"
                onChange={(e) => {
                  setInputValues({...inputValues, amount: Number(e.target.value)});
                }}
              />
              <Input
                size="md"
                placeholder="Concepto"
                onChange={(e) => {
                  setInputValues({...inputValues, concept: e.target.value});
                }}
              />
              <Input
                size="md"
                type="date"
                placeholder="Dia de pago"
                onChange={(e) => {
                  setInputValues({...inputValues, payday: e.target.value});
                }}
              />
              <Input
                size="md"
                placeholder="Nro. de Transferencia"
                onChange={(e) => {
                  setInputValues({...inputValues, billing: e.target.value});
                }}
              />
              <Input
                size="md"
                placeholder="Nro. Factura"
                onChange={(e) => {
                  setInputValues({...inputValues, invoice: e.target.value});
                }}
              />
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={() => {
                createNewPayment(inputValues);
              }}
            >
              Guardar
            </Button>
            <Button variant="outline" mr={3} onClick={drawerCreateOnClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

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
                  <Stack spacing={2}>
                    <Button
                      colorScheme="green"
                      ref={btnRef}
                      onClick={() => {
                        setChangePaymentData(payment);
                        drawerEditOnOpen();
                      }}
                    >
                      <AiOutlineEdit />
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={() => {
                        setPaymentData(payment);
                        alertOnOpen();
                      }}
                    >
                      <BsTrash />
                    </Button>
                  </Stack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/*Edit Drawer */}
      <Drawer size={"md"} isOpen={drawerEditIsOpen} placement="right" onClose={drawerEditOnClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Text>Editar Pago</Text>
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing={3}>
              <Center>
                <Text fontSize="2xl">{changePaymentData.personName}</Text>
              </Center>
              <Select
                options={modalityOptions}
                placeholder="Modalidad"
                defaultValue={changePaymentData.modality}
                isSearchable={false}
                onChange={(e) => {
                  setChangePaymentData({...changePaymentData, modality: e.value});
                }}
              />
              <Select
                options={accountsOptions}
                placeholder="Cuenta"
                defaultValue={changePaymentData.account}
                isSearchable={false}
                onChange={(e) => {
                  setChangePaymentData({...changePaymentData, account: e.value});
                }}
              />
              <Input
                size="md"
                placeholder="Monto"
                defaultValue={changePaymentData.amount}
                onChange={(e) => {
                  setChangePaymentData({...changePaymentData, amount: e.value});
                }}
              />
              <Input
                size="md"
                placeholder="Concepto"
                defaultValue={changePaymentData.concept}
                onChange={(e) => {
                  setChangePaymentData({...changePaymentData, concept: e.value});
                }}
              />
              <Input
                size="md"
                type="date"
                placeholder="Dia de pago"
                defaultValue={changePaymentData.payday}
                onChange={(e) => {
                  setChangePaymentData({...changePaymentData, payday: e.target.value});
                }}
              />
              <Input
                size="md"
                placeholder="Nro. de Transferencia"
                defaultValue={changePaymentData.billing}
                onChange={(e) => {
                  setChangePaymentData({...changePaymentData, billing: e.value});
                }}
              />
              <Input
                size="md"
                placeholder="Nro. Factura"
                onChange={(e) => {
                  setInputValues({...inputValues, invoice: e.target.value});
                }}
              />
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Text>Id Pago: {changePaymentData.id}</Text>
            <Button
              colorScheme="green"
              mr={3}
              onClick={() => {
                updatePayment(changePaymentData);
                drawerEditOnClose();
              }}
            >
              Guardar
            </Button>
            <Button variant="outline" mr={3} onClick={drawerEditOnClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <AlertDialog motionPreset="slideInBottom" leastDestructiveRef={cancelRef} onClose={alertOnClose} isOpen={alertIsOpen} isCentered>
        <AlertDialogContent>
          <AlertDialogHeader>Estas segur@?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>Tene cuidado que si lo eliminas se van a eliminar todos los pagos asociados y tambien todos los datos del usuario, es un camino sin retorno.</AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => {
                alertOnClose();
                setPaymentData(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={() => {
                deletePayment(paymentData.id); // Cambiado de "deleteStudent" a "deletePayment"
                alertOnClose();
              }}
            >
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PaymentsList;
