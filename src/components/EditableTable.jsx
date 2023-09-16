import {useState, useEffect} from "react";
import Select from "react-select";

const EditableTable = (props) => {
  const {data} = props;
  const [studentData, setStudentData] = useState(data);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [editingUserId, setEditingUserId] = useState(null);
  const [initialSelectedOptions, setInitialSelectedOptions] = useState({});

  const attendsList = ["Mar23-N1", "Mar23-N2", "Mar23-N3", "Mar23-N4", "Mar23-N5", "Mar23-N6", "Ago23-N1", "Ago23-N2", "Ago23-N3", "Ago23-N4", "Ago23-N5", "Ago23-N6", "Mar22-N1", "Mar22-N2", "Mar22-N3", "Mar22-N4", "Mar22-N5", "Mar22-N6", "Ago22-N1", "Ago22-N2", "Ago22-N3", "Ago22-N4", "Ago22-N5", "Ago22-N6", "Mar21-N1", "Mar21-N2", "Mar21-N3", "Mar21-N4", "Mar21-N5", "Mar21-N6", "Ago21-N1", "Ago21-N2", "Ago21-N3", "Ago21-N4", "Ago21-N5", "Ago21-N6", "Mar20-N1", "Mar20-N2", "Mar20-N3", "Mar20-N4", "Mar20-N5", "Mar20-N6", "Ago20-N1", "Ago20-N2", "Ago20-N3", "Ago20-N4", "Ago20-N5", "Ago20-N6", "Mar19-N1", "Mar19-N2", "Mar19-N3", "Mar19-N4", "Mar19-N5", "Mar19-N6", "Ago19-N1", "Ago19-N2", "Ago19-N3", "Ago19-N4", "Ago19-N5", "Ago19-N6"];

  useEffect(() => {
    setStudentData(data);
  }, [data]);

  const attendsOptions = attendsList.map((attend) => ({
    value: attend,
    label: attend,
  }));

  const onChangeInput = (e, studentId) => {
    const {name, value} = e.target;
    const editData = studentData.map((item) => (item.id === studentId ? {...item, [name]: value} : item));
    setStudentData(editData);
  };

  const handleEditUser = (userId) => {
    setEditingUserId(userId);
    setInitialSelectedOptions({
      ...initialSelectedOptions,
      [userId]: selectedOptions[userId] || [],
    });
  };

  const handleSaveUser = (userId) => {
    const userSelectedOptions = initialSelectedOptions[userId] || [];

    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [userId]: userSelectedOptions,
    }));

    setEditingUserId(null);
  };

  const handleSelectChange = (selectedOption, studentId) => {
    setSelectedOptions(selectedOptions.concat(selectedOption));
    console.log(selectedOption);
  };

  return (
    <div className="container">
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Attends</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          {studentData.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{editingUserId === row.id ? <input name="name" value={row.name} type="text" onChange={(e) => onChangeInput(e, row.id)} placeholder="Type Name" /> : row.name}</td>
              {/* Otros campos similares */}
              <td>
                {editingUserId === row.id ? (
                  <Select
                    options={attendsOptions}
                    value={selectedOptions[row.id] || []}
                    onChange={(selectedOption) => {
                      handleSelectChange(selectedOption, row.id);
                    }}
                    closeMenuOnSelect={false}
                    isMulti
                  />
                ) : (
                  <span>{row.attends}</span>
                )}
              </td>
              {/* Otros campos similares */}
              <td>{editingUserId === row.id ? <input name="position" value={row.position} type="text" onChange={(e) => onChangeInput(e, row.id)} placeholder="Type Position" /> : row.position}</td>
              <td>{editingUserId === row.id ? <button onClick={() => handleSaveUser(row.id)}>Guardar</button> : <button onClick={() => handleEditUser(row.id)}>Editar usuario</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EditableTable;
