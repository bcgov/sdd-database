# Asset Tag 

## Asset

The Access DB thinks an Asset to be one of the following
- Laptop
  - Windows
  - Macbook Pro
- Surface Pro
- Desktop Computer
- Public Job Bank Kiosk

Apparently Asset Tags are not required for Non-SDD folks?

This field can also be called Asset / Computer / Hardware Number

**Data Constraints**

- Laptops, desktops, and Surface Pro 8 - alpha and numeric. 8 character limit.
- Surface Pro 11 - alpha and numeric. 14 character limit with letter B prefix.
- Mac Book Pro - alpha and numeric. 10 character limit. Cannot be duplicated.

---

# Hardware

Computer Asset Hardware Model Types

These are the values in the Access DB Lookup List:
- T580 (1 record)
- T590 (no records with this value)
- T14 (80 records)
- T15 (118 records)
- T16 (1305 records)
- Thinkstation P360 (1 record)
- High Performance (21 records)
- Mac Book Pro (2 records)
- Surface Pro 7 (no records with this value)
- Surface Pro 8 (5 records)
- Surface Pro 11 (199 records)
- Kiosk - Thinkcentre M80Q (67 records)

Need to think of which categories do these belong to
- Lenovo ThinkPad T15 (Archived/Retired)
- Lenovo ThinkPad T580 (Archived/Retired)
- Lenovo ThinkStation P360
- Surface Pro 8 (Archived/Retired)

My List

- Standard Tier Devices
  - Lenovo ThinkPad T14 
  - Lenovo ThinkPad T16
- Premium Tier Devices
  - Microsoft Surface Pro 11
- High Performance Tier Devices
  - Lenovo ThinkPad P16
  - MacBook M4 Pro 16"

All modal types

- Lenovo ThinkPad T14 
- Lenovo ThinkPad T15
- Lenovo ThinkPad T16
- Lenovo ThinkPad T580
- Lenovo ThinkStation P360

- Microsoft Surface Pro 8
- Microsoft Surface Pro 11

- Lenovo ThinkPad P16
- Apple MacBook Pro

# Office Number

My understanding
Only workstations not assigned to an employee have their own office number
For workstations assigned to an employee, the asset just takes the employee's office number

So, by that thinking, I need to add an office number attribute to workstation right?
Also, need to make it mandatory

Also, while seeding, I can perhaps add an assertion that if device is assigned then employee office should be equal 
to device office?

Also, every time an employee's office number changes, I need to make sure that their assigned device's office number 
is also updated. So will have to add another sync like function in db layer

Also, let's employee E1 has workstation W1. Both will have office O1
Now, if the workstation is unassigned, then the workstation's office code remains O1.
There can be situations in which the workstation is recalled to another office O2. So, in that case, office code of 
workstation becomes O2 only when a person at O2 confirms acknowledgement/receival of workstation in their hands

# REDEPLOY

Assigned To takes this value

Laptop is in idle state or in simpler words, the asset is not currently assigned to an employee but rather it is making up part of our inventory

Indicate REDEPLOY for assets recalled to a shipping hub when an employee leaves a position.

Note in the status field, where the asset was recalled to and on what date

or Note REDEPLOY if a laptop is to be held at an office and note in the Status Column the reason why the asset is 
being held along with the date.

Office Code is not updated until received at shipping hub.

Ideally, everytime, a workstation becomes in REDEPLOY state, it is recalled to one of the inventory hubs. Sometimes 
though it isn't and remains in the office (e.g. a new hire quits in a week and the elist person accepts the role)

# Inventory Hub

These are just offices that have coordinators from the facilities and assets team like GAULAKH and CSQUIRE who track 
these workstations.

Currently, these offices are
331
350
So, these will naturally have a lot of redeploy workstations
This is not a fixed list and keeps on changing as per who in the team is performing these duties and which office do 
they belong to

I think another name for this is a shipping hub (not sure)

# REASSIGN

Update IDIR field to REASSIGN once the asset has been received at a shipping hub.

# Shipped / Recalled

This note is added to the Status column

"Shipped to employee name, office code" - indicates that an asset has been shipped to an employee at an office, the 
laptop is in transit and once received at the target destination, the note will be removed, and the office code updated to indicate its current location.

"Recalled to office code" – indicates that an asset has been recalled from an office and is in transit back to one of our inventory hubs to await reassignment.
This happens when an employee with an assigned workstation leaves the ministry/govt. So, after they leave, their 
workstation is recalled to inventory. Assigned To becomes REDEPLOY

So, essentially, recall is when a workstation is taken back from a departing/leaving employee and shipping is when a 
workststion is assigned to a new hire employee

# Status

Looking at all this
REDEPLOY, REASSIGN
SHIPPED, RECALLED
REFRESH

Maybe we can have similar status 3 way toggle button for workstations as well (doesn't have to be 3 way can be more)

Status Options
Redeploy/Inventory/Unassigned/Available
Shipping/Recalling/In Transit (across offices)
Assigned/Occupied

Available | In Transit | Assigned

Technically, if the above 3 are the 3 status options, unlike workspace, these aren't mutually exclusive i.e.
- a device can be in transit (recalled to inventory hub) and avaialble(redeploy state)
- a device can be in transit (shipped to a new hire) and assigned

So, maybe instead of a 3 way toggle button as we have on workspace, we can have the shipping/transit displayed with
office number field

So, call the field like Where's the workstation at / Workstation Location
- Can be at a particular office
- Can be in transit
  - If this is the case, then perhaps option to further specify from office and to office
  - Can have contextual Reveived/Confirm Received
    - Pressing this makes the workstation be at a particular office (value of to office field)
  - Just like hold needs a position number field, Shipping/Recalling/In Transit needs a From Office and To Office field

If the current Status is
Shipping/Recalling/In Transit (across offices)

The Received button should move it back to available?

My question is that when an asset is in transit stage - is it eligible for assignment? Or does it need to be first
in the other 2 states i.e. assigned/unassigned
I reckon it is

# Workstation Matching Process

Some people joining are from anothing ministry getting into our SDPR. They might have their own workstation with 
them. So, a operator in JJ's team just creates a workstation record with this asset tag.

Others (brand new employees to govt) are randomly given a workstation from the list of redeployed assets


# Refresh

Here's what should happen when the refresh button is clicked on a device,

1. The device details are saved/captured for the employee (will have to figure out where logically to save it in the DB)
2. The workstation is deleted 
3. Show options for selecting new device 
4. Activate assign mode but for devices (from employees)

Need to store information about one previous device held by any employee

In Status Field: "Refreshed NE08####" - this is the legacy asset number prior to it being refreshed. This note is 
put in the field when an asset gets refreshed and is later removed from the status field when our team completes an office update. An office update is essentially our team exporting all records for a certain office code, in excel format, and providing them to our office contacts requesting they confirm the information is accurate. ISD has a completed list of refreshed laptops.  We could create a separate field for these but the need to follow up is rare

I am thinking in the workstation view modal, there should be a refresh button. Clicking that should open assign mode.

This assign mode should now show a list of workstations, one of which can be selected.
Below along with the go back button, should be the add new workstation button. This would allow the end user to 
create a new workstation in the system and then select that as the refreshed workstation.

# Workstation History

For each employee, keep a note of previous workstation. Here are the specific fields,
- Asset Tag
- Harwdare/Model

