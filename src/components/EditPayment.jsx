/* eslint-disable react/prop-types */
import {Center, Text, Button, useDisclosure, Input, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Stack} from "@chakra-ui/react";
import {accountsOptions, modalityOptions, transformDateFormat} from "../assets/variablesGlobals.jsx";

import {useState} from "react";
import {AiOutlineEdit} from "react-icons/ai";
import PocketBase from "pocketbase";
import Select from "react-select";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

const pb = new PocketBase("https://manos-que-hablan-db.onrender.com");

{
  /* Edit Payment */
}
const EditPayment = ({payment}) => {
  const {isOpen: drawerEditIsOpen, onOpen: drawerEditOnOpen, onClose: drawerEditOnClose} = useDisclosure();
  const [editedPayment, setEditedPayment] = useState(payment);

  const updatePayment = async (data) => {
    try {
      const dataSave = {
        ...data,
      };

      const record = await pb.collection("payments").update(dataSave.id, dataSave);
      console.log(record);
      alertify.success("Pago Actualizado");
    } catch (error) {
      console.error("Error al actualizar el pago:", error);
      alertify.error("Error al actualizar el pago");
    }
  };

  return (
    <>
      <Button
        colorScheme="green"
        width={{base: "100%", md: "auto"}}
        onClick={() => {
          drawerEditOnOpen();
        }}
      >
        <AiOutlineEdit />
      </Button>
      <Drawer size={"md"} isOpen={drawerEditIsOpen} placement="right" onClose={drawerEditOnClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Text>Editar Pago</Text>
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing={3}>
              <Center>
                <Text fontSize="2xl">{editedPayment.personName}</Text>
              </Center>
              <Select
                options={modalityOptions}
                placeholder="Modalidad"
                defaultValue={{
                  value: editedPayment.modality,
                  label: editedPayment.modality,
                }}
                isSearchable={false}
                onChange={(e) => {
                  setEditedPayment({...editedPayment, modality: e.value});
                }}
              />
              <Select
                options={accountsOptions}
                placeholder="Cuenta"
                defaultValue={{
                  value: editedPayment.account,
                  label: editedPayment.account,
                }}
                isSearchable={false}
                onChange={(e) => {
                  setEditedPayment({...editedPayment, account: e.value});
                }}
              />
              <Input
                size="md"
                placeholder="Monto"
                defaultValue={editedPayment.amount}
                onChange={(e) => {
                  setEditedPayment({...editedPayment, amount: e.target.value});
                }}
              />
              <Input
                size="md"
                placeholder="Concepto"
                defaultValue={editedPayment.concept}
                onChange={(e) => {
                  setEditedPayment({...editedPayment, concept: e.target.value});
                }}
              />
              <Input
                size="md"
                type="date"
                placeholder="Dia de pago"
                defaultValue={transformDateFormat(editedPayment.payday)}
                onChange={(e) => {
                  setEditedPayment({...editedPayment, payday: e.target.value});
                }}
              />
              <Input
                size="md"
                placeholder="Nro. de Transferencia"
                defaultValue={editedPayment.billing}
                onChange={(e) => {
                  setEditedPayment({...editedPayment, billing: e.target.value});
                }}
              />
              <Input
                size="md"
                placeholder="Nro. Factura"
                defaultValue={editedPayment.invoice}
                onChange={(e) => {
                  setEditedPayment({...editedPayment, invoice: e.target.value});
                }}
              />
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Text>Id Pago: {editedPayment.id}</Text>
            <Button
              colorScheme="green"
              mr={3}
              onClick={() => {
                updatePayment(editedPayment); // Pass the updated editedPayment object
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
    </>
  );
};

export default EditPayment;
