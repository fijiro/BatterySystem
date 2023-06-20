import { DependencyContainer } from "tsyringe";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { CustomItemService } from "@spt-aki/services/mod/CustomItemService";
import { NewItemFromCloneDetails } from "@spt-aki/models/spt/mod/NewItemDetails";
import { IPostAkiLoadMod } from "@spt-aki/models/external/IPostAkiLoadMod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";

class Mod implements IPostDBLoadMod {
    public postDBLoad(container: DependencyContainer): void {
        // Resolve the CustomItemService container
        const CustomItem = container.resolve<CustomItemService>("CustomItemService");
        const db = container.resolve<DatabaseServer>("DatabaseServer");
        const items = db.getTables().templates.items;

        const AAABattery: NewItemFromCloneDetails = {
            itemTplToClone: "5672cb124bdc2d1a0f8b4568",
            overrideProperties: {
                StackMaxSize: 3,
                Resource: 100,
                MaxResource: 100,
                Unlootable: true,
                UnlootableFromSlot: "SpecialSlot",
                UnlootableFromSide: [
                    "Bear",
                    "Usec",
                    "Savage"
                ]
            }, //Overrided properties basically tell the server on what data inside _props to be modified from the cloned item
            parentId: "5447e0e74bdc2d3c308b4567", //ParentId refers to the Node item it will be under, you can check it in https://db.sp-tarkov.com/search
            newId: "aaa-battery",
            fleaPriceRoubles: 50000,
            handbookPriceRoubles: 40000,
            handbookParentId: "5b47574386f77428ca22b345", //Handbook parent can be found in Aki_Data\Server\database\templates.

            locales: {
                "en": {
                    name: "Triple A Battery",
                    shortName: "AAA Battery",
                    description: "A standard triple A battery. Used in a wide variety of electronics, such as night-vision devices, flashlights and laser pointers."
                }
            }
        }
        CustomItem.createItemFromClone(AAABattery); //Basically calls the function and tell the server to add our Cloned new item into the server

        // huge thanks and credit to jbs4mx! https://github.com/jbs4bmx/SpecialSlots/
        const pockets = items["627a4e6b255f7527fb05a0f6"];
        pockets._props.Slots[0]._props.filters[0].Filter.push("aaa-battery");
        pockets._props.Slots[1]._props.filters[0].Filter.push("aaa-battery");
        pockets._props.Slots[2]._props.filters[0].Filter.push("aaa-battery");       

        //add the requirement for batteries in raid
        for (let i in items) {
            //check that it isnt NightVision or ThermalVision, and is either NVG/Thermal sight, NVG/Thermal goggles or T-7.
            if (items[i]._id != "5a2c3a9486f774688b05e574" && items[i]._id != "5d21f59b6dbe99052b54ef83" && (items[i]._parent == "55818aeb4bdc2ddc698b456a" || items[i]._parent == "5a2c3a9486f774688b05e574" || items[i]._parent == "5d21f59b6dbe99052b54ef83")) {
                console.log(items[i]._id + " Special Sight added battery slot");
                items[i]._props.Slots.push( 
                    {
                        _name: "mod_gear", //change background image, only one mod_tactical can be used at once
                        _id: "slotid_" + i.toString, // has to be unique 
                        _parent: "slotparent_" + i.toString, // doesn't do anything?
                        _props: {
                            filters: [
                                {
                                    Shift: 0,
                                    Filter: [
                                        "aaa-battery"
                                    ]
                                }
                            ]
                        },
                        _max_count: 1,
                        _required: true,
                        _mergeSlotWithChildren: false,
                        _proto: "" //physical position?
                    }
                );
            }
        }
    }
    /*Check if our item is in the server or not
    public postAkiLoad(container: DependencyContainer): void {
        const db = container.resolve<DatabaseServer>("DatabaseServer");
        const item = db.getTables().templates.items;
        console.log(item["aaa-battery"]._props);
        console.log(item["battery-nvg"]._props)
    }*/
    private update(container: DependencyContainer): void {

    }
}

module.exports = { mod: new Mod() }