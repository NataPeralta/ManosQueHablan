/* eslint-disable react/prop-types */
import {Text, Button, useDisclosure, Input, Stack, Center, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter} from "@chakra-ui/react";
import {accountsOptions, modalityOptions} from "../assets/variablesGlobals.jsx";
import AsyncSelect from "react-select/async";
import {useState} from "react";
import "alertifyjs/build/css/alertify.css";
import PocketBase from "pocketbase";
import alertify from "alertifyjs";
import Select from "react-select";

const pb = new PocketBase("https://manos-que-hablan-db.onrender.com");

const CreatePayment = ({studentData}, studentId) => {
  const {isOpen: drawerCreateIsOpen, onOpen: drawerCreateOnOpen, onClose: drawerCreateOnClose} = useDisclosure();
  const [createPaymentData, setCreatePaymentData] = useState({
    payday: "",
    person: studentId ? studentId : "",
    amount: "",
    account: "",
    concept: "",
    modality: "",
    billing: "",
    invoice: "",
  });

  const createNewPayment = async (paymentData) => {
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

  const studentsOptions = async (inputValue) => {
    const students = await pb.collection("students").getFullList();
    const filteredStudents = students.filter((student) => student.name.toLowerCase().includes(inputValue.toLowerCase()));

    const options = filteredStudents.map((student) => ({
      label: student.name,
      value: student.id,
    }));
    return options;
  };

  return (
    <>
      <Button
        onClick={() => {
          drawerCreateOnOpen();
        }}
      >
        Crear pago
      </Button>

      {/*Create Payment */}
      <Drawer size={"md"} isOpen={drawerCreateIsOpen} placement="right" onClose={drawerCreateOnClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Crear pago</DrawerHeader>

          <DrawerBody>
            <Stack>
              {studentData ? (
                <Center>
                  <Text>{studentData.name}</Text>
                </Center>
              ) : (
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  placeholder="Buscar alumno..."
                  loadOptions={studentsOptions}
                  onChange={(e) => {
                    setCreatePaymentData({...createPaymentData, person: e});
                  }}
                />
              )}

              <Select
                options={modalityOptions}
                placeholder="Modalidad"
                isSearchable={false}
                onChange={(e) => {
                  setCreatePaymentData({...createPaymentData, modality: e.value});
                }}
              />
              <Select
                options={accountsOptions}
                placeholder="Cuenta"
                isSearchable={false}
                onChange={(e) => {
                  setCreatePaymentData({...createPaymentData, account: e.value});
                }}
              />
              <Input
                size="md"
                placeholder="Monto"
                onChange={(e) => {
                  setCreatePaymentData({...createPaymentData, amount: Number(e.target.value)});
                }}
              />
              <Input
                size="md"
                placeholder="Concepto"
                onChange={(e) => {
                  setCreatePaymentData({...createPaymentData, concept: e.target.value});
                }}
              />
              <Input
                size="md"
                type="date"
                placeholder="Dia de pago"
                onChange={(e) => {
                  setCreatePaymentData({...createPaymentData, payday: e.target.value});
                }}
              />
              <Input
                size="md"
                placeholder="Nro. de Transferencia"
                onChange={(e) => {
                  setCreatePaymentData({...createPaymentData, billing: e.target.value});
                }}
              />
              <Input
                size="md"
                placeholder="Nro. Factura"
                onChange={(e) => {
                  setCreatePaymentData({...createPaymentData, invoice: e.target.value});
                }}
              />
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={() => {
                createNewPayment(createPaymentData);
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
    </>
  );
};

export default CreatePayment;
