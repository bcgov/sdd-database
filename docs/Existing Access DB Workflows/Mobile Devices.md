# Office Number

- It is similar to office number for workstations right? i.e. Redeployed mobile devices can have any office but the 
moment they are assigned to an employee, they discard their current office number and take on the employee's office number.

If a mobile device is being shipped from Facilities and Assets inventory, then the office code will initially be the shipping hub office code. When the mobile device is received at the target location, the office code is meant to be updated in the mobile devices table to indicate the mobile device is at the employee's headquarter location.

- If the assigned employee's office number changes, then so does the mobile device's office number

Correct, assuming no change in employee job title and that the employee still requires a mobile phone in their role.

- If the employee is unassigned, then the office number remains unchanged but now it no longer updates with a change 
in the previously assigned employee's office

If the employee is unassigned, the mobile device is recalled to a shipping hub. When the mobile device is received at the shipping hub, the office code will be updated to reflect the mobile device is at the shipping hub. 

## Hardware

### Satellite Phones

Does satellite phones not have IMEI like we don't have IMEI for OiaBs?

I don't know much about Satellite phones as there is only one in the DB and is from before I worked here. I believe they are for Business Continuity Plans where if there is an emergency, they have a phone to use if all regular lines are down. My understanding is their IMEI is structured differently as why it is tracked in the Notes section. The IMEI is "ESN DEC: 11601169260" Phone number is also tracked as "00 403-987-3129." If you need further elaboration, JJ may know more than I do. - EC May'5
 