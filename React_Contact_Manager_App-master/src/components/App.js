
import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {v4 as uuid} from 'uuid';
import api from '../api/contacts';
import "./App.css";
import Header from "./Header";
import AddContact from "./AddContact";
import ContactList from "./ContactList";
import ContactDetail from "./ContactDetail";
import EditContact from "./EditContact";
function App(props){
 
  const LOCAL_STORAGE_KEY="contacts";
  const [contacts, setContacts] = useState(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) ?? []
  );
  const [searchTerm, setSearchTerm] = useState(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) ?? ""
  );
  const [searchResults, setSearchResults] = useState(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) ?? []
  );
  // Retrieve contacts
  const retrieveContacts=async()=>{
    const response=await api.get("/contacts");
    return response.data;
  }
  const addContactHandler= async (contact)=>{
    console.log(contact);
    const request={
      id: uuid(),
      ...contact
    }
    const response=await api.post("/contacts",request);
    setContacts([...contacts, response.data]);
  };
  const updateContactHandler=async (contact)=>{
    const response=await api.put(`/contacts/${contact.id}`,contact);
    const{id}=response.data;
    setContacts(contacts.map((contact)=>{
         return contact.id===id?{...response.data}:contact;
    })
    );
   };
  // const updateContactHandler= (contact)=>{
  //   const simulateApiCall = (updatedContact) => {
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         resolve(updatedContact);
  //       }, 1000); // Simulating a 1-second delay
  //     });
  //   };
  
  //   // Call the simulateApiCall function and update the contact
  //   simulateApiCall(contact).then((updatedContact) => {
  //     const { id, name, email } = updatedContact;
  //     setContacts((prevContacts) =>
  //       prevContacts.map((prevContact) =>
  //         prevContact.id === id ? { ...updatedContact } : prevContact
  //       )
  //     );
  //   });
  // };
  const removeContactHandler= async (id)=>{
       await api.delete(`/contacts/${id}`);
      const newContactList=contacts.filter((contact)=>{
        return contact.id!==id;
      });

      setContacts(newContactList);
  }

  const searchHandler=(searchTerm)=>{
      setSearchTerm(searchTerm);
      if(searchTerm !==""){
        const newContactList=contacts.filter((contact)=>{
          return Object.values(contact).join(" ").toLowerCase().includes(searchTerm.toLowerCase());
        });
        setSearchResults(newContactList);
      }
      else{
        setSearchResults(contacts);
      }
  }
  // useEffect(() => {
  //       const retriveContacts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  //       if (retriveContacts) setContacts(retriveContacts);
  //     }, []);
  useEffect(() => {
      // const retriveContacts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
      // if (retriveContacts) setContacts(retriveContacts);
      const getAllContacts=async()=>{
        const allContacts=await retrieveContacts();
        if(allContacts) setContacts(allContacts); 
      };
     getAllContacts();
    }, []);
    
      useEffect(() => {
       //localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
      }, [contacts]);

  return (
    <div className="ui container">
      <Router>
        <Header/>
        <Switch>
        <Route 
              path="/" 
              exact 
        //       component={()=>(
        //       <ContactList contacts={contacts} 
        //       getContactId={removeContactHandler }/>
        // )}
              render={(props)=>(
                <ContactList
                    {...props}
                    contacts={searchTerm.length < 1 ? contacts: searchResults}
                    getContactId={removeContactHandler }
                    term={searchTerm}
                    searchKeyword={searchHandler}
                />
             )}
        />
        <Route 
              path="/add" 
        //     component={()=>(
        //     <AddContact  addContactHandler={addContactHandler}/>
        // )}
              render={(props)=>(
                <AddContact
                    {...props}
                    addContactHandler={addContactHandler}
                  />
             )}
        />
        <Route 
              path="/edit" 
        //     component={()=>(
        //     <AddContact  addContactHandler={addContactHandler}/>
        // )}
              render={(props)=>(
                <EditContact
                    {...props}
                    updateContactHandler={updateContactHandler}
                  />
             )}
        />
        <Route path="/contact/:id" component={ContactDetail}/>
        </Switch>
         {/* <AddContact addContactHandler={addContactHandler}/>
        <ContactList contacts={contacts} getContactId={removeContactHandler 
        }/> */}
      </Router>
    </div>
  );
}
export default App;