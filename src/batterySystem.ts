import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { CustomItemService } from "@spt-aki/services/mod/CustomItemService";
import { NewItemFromCloneDetails } from "@spt-aki/models/spt/mod/NewItemDetails";
import { IPostAkiLoadMod } from "@spt-aki/models/external/IPostAkiLoadMod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";

class Mod implements IPostDBLoadMod, IPostAkiLoadMod {
    public postDBLoad(container: DependencyContainer): void {
        // Resolve the CustomItemService container
        const CustomItem = container.resolve<CustomItemService>("CustomItemService");

        const db = container.resolve<DatabaseServer>("DatabaseServer");
        const item = db.getTables().templates.items;
        
        //Example of adding new item by cloning existing item using createclonedetails
        const testNVG: NewItemFromCloneDetails = {
            itemTplToClone: "5c066e3a0db834001b7353f0",
            overrideProperties: {
                Grids: [],
                Slots: [
                    {
                        _name: "mod_tactical",
                        _id: "5a1eac63fcdbcb001a3b0108",
                        _parent: "5447e0e74bdc2d3c308b4567",
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
                        _required: false,
                        _mergeSlotWithChildren: false,
                        _proto: "amogus"
                    }
                ]
            },
            parentId: "5a2c3a9486f774688b05e574",
            newId: "battery-nvg",
            fleaPriceRoubles: 50000,
            handbookPriceRoubles: 40000,
            handbookParentId: "5b5f749986f774094242f199",
            locales: {
                "en": {
                    name: "Battery NVG",
                    shortName: "BNVG",
                    description: "Test NVG that drains batteries."
                }
            }
        }
        CustomItem.createItemFromClone(testNVG);

        const AAABattery: NewItemFromCloneDetails = {
            itemTplToClone: "5672cb124bdc2d1a0f8b4568", //the item we want to clone
            overrideProperties: {
                Unlootable: true,
                UnlootableFromSlot: "SpecialSlot",
                UnlootableFromSide: [
                    "Bear",
                    "Usec",
                    "Savage"
                ]
                /*
                try adding this as an ammo for the electronics
                Cartridges?: Slot[];
                Chambers?: Slot[];
                MaxDurability?: number;
                OperatingResource?: number;
                MaxRepairResource?: number;
                TargetItemFilter?: string[];
                export interface SlotProps {
                filters: SlotFilter[];
                }
                */
            }, //Overrided properties basically tell the server on what data inside _props to be modified from the cloned item
            parentId: "5447e0e74bdc2d3c308b4567", //ParentId refers to the Node item the gun will be under, you can check it in https://db.sp-tarkov.com/search
            newId: "aaa-battery", //The new id of our cloned item
            fleaPriceRoubles: 50000, //Self explanatary
            handbookPriceRoubles: 40000,
            handbookParentId: "5b47574386f77428ca22b345", //Handbook Parent Id refers to the category the gun will be under
            //you see those side box tab thing that only select gun under specific icon? Handbook parent can be found in Aki_Data\Server\database\templates.
            locales: {
                "en": {
                    name: "Triple A Battery",
                    shortName: "AAA Battery",
                    description: "A standard triple A battery. Used in a wide variety of electronics, such as night-vision devices, flashlights and laser pointers."
                }
            }
        }
        CustomItem.createItemFromClone(AAABattery); //Basically calls the function and tell the server to add our Cloned new item into the server
    }
    //Check if our item is in the server or not
    public postAkiLoad(container: DependencyContainer): void {
        const db = container.resolve<DatabaseServer>("DatabaseServer");
        const item = db.getTables().templates.items;
        console.log(item["aaa-battery"]._props);
        console.log(item["battery-nvg"]._props)
    }
}

module.exports = { mod: new Mod() }