import { Popper } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const DropdownLanguage = () => {
    const { i18n, t } = useTranslation();
    const [language, setLanguage] = useState(JSON.parse(localStorage.getItem('language') || "null" ));
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [open, setOpen] = useState<any>(false);
    const id = open ? 'simple-popper' : "";

    useEffect(() => {
        localStorage.setItem('language', JSON.stringify(language));
    }, [language]);

    const handleLangChange = (lang: any) => {
        setLanguage(lang);
        i18n.changeLanguage(lang);
        setOpen(false);
    };

    const handleClick = (event: any) => {
        const { currentTarget } = event;
        setAnchorEl(currentTarget)
        setOpen(!open)
    };

    const handleClickAway = () => {
        setOpen(false)
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div>
                <button onClick={handleClick} className="language-switcher">
                    {t("app_bar.language."+language)}
                </button>
                <Popper id={id} open={open} anchorEl={anchorEl} className="language-popper">
                    <button
                        onClick={() => handleLangChange("en")}
                        className="btn"
                    >
                        {t("app_bar.language.en")}
                    </button>
                    <button
                        onClick={() => handleLangChange("zh")}
                        className="btn"
                    >
                        {t("app_bar.language.zh")}
                    </button>       
                </Popper>
            </div>
        </ClickAwayListener>
    );
};

export default DropdownLanguage;
