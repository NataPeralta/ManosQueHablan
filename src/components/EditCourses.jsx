import React, {useEffect, useState} from "react";
import PocketBase from "pocketbase";
import AsyncSelect from "react-select/async";
import {Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Button, Input, Stack, Text} from "@chakra-ui/react";
import {useDisclosure} from "@chakra-ui/react";
import alertify from "alertifyjs";

const pb = new PocketBase("https://manos-que-hablan-db.onrender.com");

const EditCourses = ({allStudents, courseData}) => {
  const [studentsInCourseOptions, setStudentsInCourseOptions] = useState([]);
  const [studentsNotInCourseOptions, setStudentsNotInCourseOptions] = useState([]);
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [formData, setFormData] = useState({
    name: "",
    year: "",
    semester: "",
    level: "",
  });
  const btnRef = React.useRef();

  useEffect(() => {
    fetchStudentOptions();
  }, [allStudents]);

  if (!courseData) {
    return <div>Loading...</div>;
  }

  async function fetchStudentOptions() {
    try {
      const studentsRecord = await pb.collection("students").getFullList();

      const courseStudentIds = allStudents.map((student) => student.id);

      const studentsOptions = studentsRecord.map((student) => ({
        label: student.name,
        value: student.id,
      }));

      const studentsInCourse = studentsOptions.filter((student) => {
        return courseStudentIds.includes(student.value);
      });

      const studentsNotInCourse = studentsOptions.filter((student) => {
        return !courseStudentIds.includes(student.value);
      });

      setStudentsInCourseOptions(studentsInCourse);
      setStudentsNotInCourseOptions(studentsNotInCourse);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  }

  const updateData = async () => {
    const dataForUpdate = {
      name: formData.name,
      year: formData.year,
      semester: formData.semester,
      level: formData.level,
      students: ["RELATION_RECORD_ID"], // Reemplaza con los valores reales
    };

    const record = await pb.collection("courses").update(courseData.id, dataForUpdate);
    console.log("Curso actualizado:", record);
    alertify.success("Curso Actualizado");
    onClose();
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
        Open
      </Button>
      <Drawer size={"md"} isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Editar Curso</DrawerHeader>

          <DrawerBody>
            <Stack spacing={3}>
              <Input size="md" placeholder="Nombre" defaultValue={courseData ? courseData.name : ""} onChange={handleInputChange} />
              <Input size="md" type="number" placeholder="Año" defaultValue={courseData ? courseData.year : ""} onChange={handleInputChange} />
              <Input size="md" placeholder="Semestre" defaultValue={courseData ? courseData.semester : ""} onChange={handleInputChange} />
              <Input size="md" placeholder="Nivel" defaultValue={courseData ? courseData.level : ""} onChange={handleInputChange} />
              {studentsInCourseOptions.length > 0 ? (
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  defaultValue={studentsInCourseOptions}
                  isMulti
                  placeholder="Buscar alumnos..."
                  loadOptions={(inputValue, callback) => {
                    callback(studentsNotInCourseOptions);
                  }}
                  onChange={handleInputChange}
                />
              ) : (
                <Text>Cargando alumnos...</Text>
              )}
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={updateData}>
              Guardar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default EditCourses;
