### Desk Type

Indicates what type of desk is at the workstation

- Height Adjustable (H/A)
    - Any sit/stand desk (electronic, air touch or crank)

- Non Height Adjustable (Non-H/A)
    - Regular, Non-moving desk, stationery

- H/A Accommodation

    - Height Adjustable approved through workplace accommodation

The team wants to track any purchases made for this equipment.
This also relates to the OHS Non-Standard Ergonomic Equipment Column too where this is also tracked.
It was determined it would be best practice to track in both columns to ensure accuracy.

Note this could very well be a different product that just H/A desks

- Kiosk
    - Client accessible table/desk/computer terminal
    - workspace for client kiosks
    - Reception Area
    - No standard design and can vary

This field is linked to the workspace entity

Need to think about the same H/A Accommodation value in both desk type and OHS Accommodation column (one is linked 
to a worksapce and one is linked to an employee)

### Occupational Health and Safety (OHS) Non-Standard Ergo Equipment

 - Multivalue Lookup-list ; Can select single or multiple items.
 - Tracked ergonomic items that are approved and purchased by Occupational Helath and Safety for employees that require an accomodation.
 - Item categories: Chair, footrest, H/A Accomodation (desk), headset, keyboard, monitor, mouse, other, Software - Dragon or Jaws.

This field is linked to the employee entity
Delete when employee leaves

### Workspace Type

**Restrictions**

**Protected Community Service**
Restriction Branch: Community Service
Restriction Program Area?: Area A, B or C

**Protected File Hub**
Restriction Branch: Operations Support

**Protected Criminal Investigations Unit**
Restriction Branch: Prevention and Loss Management Services
Restriction Program Area?: Criminal Investigation Unit and surprisingly PLMS Operations as well?

---

**Description**

Free Address
Resident
Protected Community Services
Protected File Hub
Protected Criminal Investigations Unit
Kiosk

All workspaces are catagorized into a type, except Mobile workspaces.

**Protected Community Services**

Indicates program defined workspace for Community Services only, has a workspace number, and mirrors the building floor plan. If the protected workspace is not assigned, status will be Vacant.

**Protected File Hub**

Indicates program defined workspace for the File Hub only, has workspace number and mirrors
building floor plan. If the protected workspace is not assigned, status will be Vacant.

**Protected Criminal Investigations Unit**

Indicates program defined workspace for CIU only, has workspace number and mirrors building floor plan. If the protected workspace is not assigned, status will be vacant.

**Free Address**

Numbered workspaces no program defined. Utilized by employees with Telework agreements of 3 days or more. Require review before employee assigned.
i.e. unassigned workspaces that have a workspace number
or in other words
Empty/unoccupied spaces which are not protected (reserved)

I don't think we even need to specify a workspace is a free address
Because free address workspaces wouldn't have the assigned employee accordian anyways

**Vacant**

Empty/unoccupied spaces which are protected (reserved)

Similarly, I do not need to show if a workspace is vacant i.e. it will be evident that this workspace is empty.

As far as the reserved rule goes, I can factor it into employee assignment logic.

**Resident**

Free address workspaces are converted to resident workspaces for employees that attend the office more than 3 days per week.

Same thing for resident workspaces - like we don't need to explicitly mark workspaces as resident since workspace
modal that has assigned employee accordian automatically counts as resident workspace right?

### Workspace Number

The following feel more like a condition of the employee than the condition of the workspace
i.e. these feel like an employee attribute than a specific workspace attribute


**Mobile**

For employees with a Telework Agreement and work from home 3 days per week or more.

What is the opposite of mobile? Resident?
I think this is true - an employee can either be mobile or resident.

---

**Float**

for Auxillary employees that do not require an assigned workspace.

---

**Friendship Center**

For CIS that are headquartered to an office, but attached to the FC so not to affect the threshold count for the office.

---

**Offsite**

CIS employees could be working out of a society or centre.

---

### Office Floor

Note the workspace number is related to the office floor. The workspace number starts with the floor in which the workspace is

Many offices are ground level which equates to 100, 101 etc.

Office Floors range from first to eighth, eighteen and nineteen.
If there is no office floor listed, the ministry only occupies one floor in the building.

JJ updated the Database drop down to now include Floors 1 thru 20th. This will accommodate all buildings we have in the Database for the offices, including OFF 200 Vancouver. 
The drop down includes 20 floors as this will accommodate any potential future moves or changes.

The only exception is OFF 350 as the 4th Floor has workspaces that exceed 100. Workspaces 500 to 530 still populate as the 4th Floor.


### Workspace Category

**POC**

•	point of contact for client services
•	client-serving workstation
•	situated directly across from client entrance

**Interactive**

•	a public facing/ client-serving cubicle type workspace
•	Not a point of contact center
•	Transaction counter or enclosed space that can be used to interview/interact with clients

**Non Interactive**

•	a non-public / non interactive / not front facing / non client serving workspace/cubicle
•   Cannot see clients
•   Not POC
•	Include cubicles

**Non Interactive Office**
Enclosed office that is not public facing and is not used to interview clients.

**LWS Mobile Station**
At LWS (Leading Workplace Strategies/Solutions) sites, this term is used to represent workspaces that do not have 
assigned
staff at them
At LWS, staff are not always assigned a specific seat.

In essence, unlike regular workspaces that are a bit spacious, more like L shaped, with cubicle walls 
seperating them, LWS Workspaces are all squished together with no cubicle wall as a seperator and are comparatively 
smaller/tinier - they feel like they are built for open, collaborative work

**Privacy Room**
Assigned workspace numbers, but no assets (like a laptop) can be assigned to space.

Mobile - Only accesses Free Address space. Employees that WFH 3 or more days per week are designated Mobile. All CISB Specialists are designated Mobile.

**Waiting Room**

- Client waiting area where Kiosks are located.
- Client sitting area

**Interactive Office**

Enclosed office that is public facing, used to interview clients.

### Equipment

Indicates if any specialty equipment exists at the workspace, ie. Dymo Label Writer.  These items are purchased by the SDD Facilities and our budget

General equipment shipped to employees such as webcams, label printers, adapters, cables, and USB hubs.

Erin's notes: Optional data. Free text cell. Alpha and numerica. Hyphens or spaces are permitted. Character limit? Enter item and date?

My understanding is that this field is linked to the workspace entity
