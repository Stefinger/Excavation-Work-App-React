import React, { useState, useRef, useEffect } from "react";
import { employees } from "./EmployeesData";

export default function Main() {

    // HOOKS
    const renderCount = useRef(0);
    const employeeCount = useRef(employees.length);
    const [listOfEmployees, setListOfEmployees] = useState(employees);
    const [activeButton, setActiveButton] = useState('list-of-employees');
    const [validForm, setValidForm] = useState(false);
    const [menCount, setMenCount] = useState(0);
    const [womenCount, setWomenCount] = useState(0);
    const [workMeters, setWorkMeters] = useState("");
    const [workHours, setWorkHours] = useState("");
    const [planningValid, setPlanningValid] = useState(false);

    // LIST OF EMPLOYEES
    const [addEmployee, setAddEmployee] = useState({
        id: (employeeCount.current + 1),
        name: "",
        surname: "",
        sex: "",
    });

    // ENTRY
    const handleChange = (e) => {
        setAddEmployee({...addEmployee,[e.target.name] : e.target.value});
    };

    // ADD EMPLOYEE
    const handleAdd = (e) => {
        setListOfEmployees((listOfEmployees) => {
            return [...listOfEmployees, addEmployee];
        });

        employeeCount.current++;

        setAddEmployee({
            id: (employeeCount.current + 1),
            name: "",
            surname: "",
            sex: "",
        });

        const radioButtons = document.getElementsByName("sex");
        radioButtons.forEach((radio) => {
            radio.checked = false;
        });

    };

    // INPUT VERIFICATION
    const verifyData = (data) => {
        if(data.sex === ""){
            return setValidForm(false);
        }

        if(data.name === "" || data.name.trim().length <= 0){
            return setValidForm(false);
        }

        if(data.surname === "" || data.surname.trim().length <= 0){
            return setValidForm(false);
        }
        
        setValidForm(true);

    };

    // SINGLE PAGE CHANGE
    const switchButton = (e, newValue) => {
        e.preventDefault();
        const newActibeButton = newValue;
        setActiveButton(newActibeButton);
    };

    // DELETE EMPLOYEE
    const deletedEmployee = (id) => {
        setListOfEmployees(listOfEmployees.filter(employee => employee.id !== id)); 
    };

    // RENDER
    useEffect(() => {
        if(renderCount.current > 0) {
            verifyData(addEmployee);
        }
    }, [addEmployee])

    useEffect(() => {
        renderCount.current++;
    }, []);

    // NUMBER OF MEN AND WOMEN
    useEffect(() => {
        let men = 0;
        let women = 0;
    
        listOfEmployees.forEach((employee) => {
          if (employee.sex === "MEN") {
            men++;
          } else if (employee.sex === "WOMEN") {
            women++;
          }
        });
    
        setMenCount(men);
        setWomenCount(women);
      }, [listOfEmployees]);

      // CONDITION FOR WORK PALNNING
      useEffect(() => {
        const requiredMeters = parseFloat(workMeters);
        const requiredHours = parseFloat(workHours);
    
        const totalMetersPerHour = menCount * 1 + womenCount * 0.5;
        const requiredTotalMeters = requiredHours * totalMetersPerHour;
    
        const isValid =
          requiredMeters > 0 &&
          requiredHours > 0 &&
          requiredMeters <= requiredTotalMeters;
    
        setPlanningValid(isValid);
      }, [workMeters, workHours, menCount, womenCount]);

  return (
    <>
       <div className="layout">
            <div className="buttons">
                <button className={`tabButton ${
              activeButton === "list-of-employees" ? "active" : ""
            }`} activeButton={activeButton} onClick={(event) => {switchButton(event, 'list-of-employees')}}>List Of Employees</button>
                <button className={`tabButton ${activeButton === "task" ? "active" : ""}`} activeButton={activeButton} onClick={(event) => {switchButton(event, 'task')}}>Task</button>
            </div>

            { (activeButton === 'list-of-employees') &&
                <>
                    <div className="employeeList">
                        {
                            listOfEmployees.map((employee) =>(
                                <div className="employeeItem" key={employee.id} name={employee.name}>{employee.name}  {employee.surname} - {employee.sex} <div className="deleteButton" data-id={employee.id} onClick={() => {deletedEmployee(employee.id)}}>X</div></div>
                            ))
                        }
                    </div>
                    <div className="employeeForm">
                        <input className="addEmployee" name="name" placeholder="Name" value={addEmployee.name} onChange={handleChange}></input>
                        <input className="addEmployee" name="surname" placeholder="Surname" value={addEmployee.surname} onChange={handleChange}></input>
                        <div className="radioButton">
                            <label style={{marginRight: "5px"}}>
                                <input type="radio" className="addEmployee" name="sex" value="MEN" onClick={handleChange} /> MEN </label>
                            <label>
                                <input type="radio" className="addEmployee" name="sex" value="WOMEN" onClick={handleChange} /> WOMEN </label>
                        </div>
                        <button className="addButton" onClick={handleAdd} disabled={!validForm}>Add Employee</button>
                    </div>
                </>
            }
            
            { (activeButton === 'task') &&
                <div className="task">
                    <h4>Planning excavation works</h4>
                    <div className="info">
                        <span className="infoAboutEmployyes">Men: {menCount} </span>
                        <span className="infoAboutEmployyes">Women: {womenCount}</span>

                        <div className="workPlanning">
                            <input className="excavationWorks" type="number" placeholder="Enter meters..." value={workMeters}
                            onChange={(e) => setWorkMeters(e.target.value)}></input>
                            <input className="excavationWorks" type="number" placeholder="Enter the hours..." value={workHours}
                            onChange={(e) => setWorkHours(e.target.value)}></input>
                            <button className="workButton" style={{ backgroundColor: planningValid ? "green" : "red" }} disabled={!planningValid}>Work planning</button>
                        </div>
                    </div>
                </div>
            }
       </div>
    </>
  );
}
