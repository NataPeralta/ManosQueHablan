import React, { useState } from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Stack,
  Input,
  Select,
} from "@chakra-ui/react";

const PaymentDrawer = ({ isOpen, onClose, onSave, paymentData }) => {
  const [formData, setFormData] = useState(paymentData || {});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{paymentData ? "Editar Pago" : "Crear Nuevo Pago"}</DrawerHeader>

        <DrawerBody>
          <Stack spacing={3}>
            <Input
              size="md"
              placeholder="Dia de pago"
              name="payday"
              value={formData.payday || ""}
              onChange={handleInputChange}
            />
            <Select
              options={[
                { value: "Asincronico", label: "Asincronico" },
                { value: "Sincronico", label: "Sincronico" },
              ]}
              defaultValue={formData.modality || ""}
              isSearchable={false}
              name="modality"
              onChange={(e) => setFormData({ ...formData, modality: e.value })}
            />
            <Input
              size="md"
              placeholder="Monto"
              name="amount"
              value={formData.amount || ""}
              onChange={handleInputChange}
            />
            <Input
              size="md"
              placeholder="Concepto"
              name="concept"
              value={formData.concept || ""}
              onChange={handleInputChange}
            />
            <Input
              size="md"
              placeholder="Comprobante de Transferencia"
              name="billing"
              value={formData.billing || ""}
              onChange={handleInputChange}
            />
          </Stack>
        </DrawerBody>

        <DrawerFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Guardar
          </Button>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default PaymentDrawer;
