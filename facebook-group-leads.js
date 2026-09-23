class GroupScraper {
    constructor() {
        this.dbName = "fb-groups-list-storage";
        this.storeName = "members"; 
        this.db = null;
        this.scrollInterval = null; 

        this.initDb();
        this.setupUI();

        window.stopScrolling = () => this.stopScrolling();
    }

    async initDb() {
        this.db = await new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 5); 
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: "memberId" });
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async addMember(memberData) {
        if (!this.db) return;
        const transaction = this.db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);

        try {
            const request = store.put(memberData);
            request.onsuccess = () => this.updateMemberCount();
            request.onerror = (event) => console.error("Error adding member:", event.target.error, memberData);
        } catch (error) {}
    }

    async getAllMembers() {
        if (!this.db) return [];
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, "readonly");
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async clearMembers() {
        if (!this.db) return;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, "readwrite");
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();
            request.onsuccess = () => {
                this.updateMemberCount();
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    }

    async updateMemberCount() {
        const count = await this.getMemberCount();
        const counterEl = document.getElementById("fb-member-count");
        if (counterEl) {
            counterEl.textContent = count;
        }
    }

    async getMemberCount() {
        if (!this.db) return 0;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, "readonly");
            const store = transaction.objectStore(this.storeName);
            const request = store.count();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    setupUI() {
        const container = document.createElement("div");
        container.style.cssText =
            "position: fixed; bottom: 20px; right: 20px; background-color: #eee; padding: 10px; border-radius: 5px; z-index: 10000; display: flex; align-items: center; font-family: monospace; box-shadow: 0 2px 4px rgba(0,0,0,0.2);";

        const counter = document.createElement("span");
        counter.id = "fb-member-count";
        counter.textContent = "0";
        counter.style.cssText = "font-weight: bold; margin-right: 5px;";

        const downloadBtn = document.createElement("button");
        downloadBtn.textContent = "Download Members";
        downloadBtn.style.cssText =
            "margin-right: 5px; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer; background-color: #4CAF50; color: white;";
        downloadBtn.addEventListener("click", () => this.downloadMembers());

        const startStopBtn = document.createElement("button");
        startStopBtn.textContent = "Start Scrolling";
        startStopBtn.style.cssText = "margin-right: 5px; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer; background-color: #2196F3; color: white;";
        startStopBtn.addEventListener("click", () => {
            if (this.scrollInterval) {
                this.stopScrolling();
            } else {
                this.startScrolling();
                startStopBtn.textContent = "Stop Scrolling";
                startStopBtn.style.backgroundColor = "#f44336"; 
            }
        });

        const resetBtn = document.createElement("button");
        resetBtn.textContent = "Reset";
        resetBtn.style.cssText =
            "padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer; background-color: #f44336; color: white;";
        resetBtn.addEventListener("click", () => this.clearMembers());

        container.appendChild(counter);
        container.appendChild(document.createTextNode(" members - "));
        container.appendChild(downloadBtn);
        container.appendChild(startStopBtn); 
        container.appendChild(resetBtn);

        document.body.appendChild(container);
        this.makeDraggable(container); 
    }

    makeDraggable(element) {
        let posX = 0, posY = 0, dragStartX = 0, dragStartY = 0;
        element.addEventListener('mousedown', dragMouseDown);
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            document.addEventListener('mouseup', closeDragElement);
            document.addEventListener('mousemove', elementDrag);
        }
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            posX = dragStartX - e.clientX;
            posY = dragStartY - e.clientY;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            element.style.top = (element.offsetTop - posY) + "px";
            element.style.left = (element.offsetLeft - posX) + "px";
        }
        function closeDragElement() {
            document.removeEventListener('mouseup', closeDragElement);
            document.removeEventListener('mousemove', elementDrag);
        }
    }

    async downloadMembers() {
        const members = await this.getAllMembers();
        if (members.length === 0) {
            alert("No members to download.");
            return;
        }

        let messageTemplate = prompt(
            "Enter your message template (type \"First Name\" to automatically replace it with the user's first name).\n\n* A unique random code will be automatically added to the end of each message to prevent spam.\n\nExample:\nHi \"First Name\", I came across your profile...", 
            'Hi "First Name" , I came across your profile and thought you might be interested in something we\'re offering. We currently have a special deal available, and I\'d be happy to send you the details if you\'re interested.'
        );

        if (messageTemplate === null) {
            messageTemplate = ""; 
        }

        let pageTitle = document.title ? document.title.split('|')[0].trim() : "Members_List";
        let fileName = pageTitle + ".csv";

        const csvContent =
            "\uFEFFMember Name,First Name,Member ID,Account Link,Send Message,Bio / Info,Join Date,Message\n" +
            members
                .map((member) => {
                    const nameRaw = member.memberName || "";
                    const firstNameRaw = nameRaw.split(' ')[0] || ""; 
                    
                    const name = `"${nameRaw.replace(/"/g, '""')}"`;
                    const firstName = `"${firstNameRaw.replace(/"/g, '""')}"`;
                    const id = `="${member.memberId}"`; 
                    
                    const url = member.memberUrl ? `"=HYPERLINK(""${member.memberUrl}"", ""Open Profile"")"` : "";
                    const sendMsgUrl = member.memberId ? `"=HYPERLINK(""https://www.messenger.com/t/${member.memberId}"", ""Send Message"")"` : "";
                    
                    // إزالة أي فواصل أسطر من البايو عشان متبوظش خلايا الإكسيل
                    let cleanBio = member.memberBio ? member.memberBio.replace(/[\r\n]+/g, ' ') : "";
                    const bio = `"${cleanBio.replace(/"/g, '""')}"`;
                    
                    const joinDate = member.joinDate ? `"${member.joinDate.replace(/"/g, '""')}"` : "";

                    let customMsg = "";
                    if (messageTemplate) {
                        let personalizedMsg = messageTemplate
                            .replace(/"First Name"/gi, firstNameRaw)
                            .replace(/First Name/gi, firstNameRaw);
                        
                        const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
                        personalizedMsg += `\n\n[Ref: ${randomCode}]`;
                        
                        customMsg = `"${personalizedMsg.replace(/"/g, '""')}"`;
                    }

                    return `${name},${firstName},${id},${url},${sendMsgUrl},${bio},${joinDate},${customMsg}`;
                })
                .join("\n");

        // استخدام تقنية الـ Blob عشان تقدر تحمل ملايين الأعضاء بدون ما الملف يتقص
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.setAttribute("href", blobUrl);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        
        // تنظيف الذاكرة بعد التحميل
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
    }

    static extractMemberData(response) {
        if (!response || !response.data) {
            return [];
        }

        let extractedMembers = [];

        function findMemberNodes(obj) {
            if (typeof obj !== 'object' || obj === null) return;

            if (obj.node && obj.node.id && obj.node.__typename === "User") {
                
                let memberName = obj.node.name ? obj.node.name.trim() : "";
                let memberId = obj.node.id || "";
                let memberUrl = "https://www.facebook.com/" + memberId + "/";
                
                let memberBio = "";
                if (obj.node.bio_text && obj.node.bio_text !== null && obj.node.bio_text.text) {
                    memberBio = obj.node.bio_text.text.trim();
                }

                let joinDate = "";
                if (obj.join_status_text && obj.join_status_text !== null && obj.join_status_text.text) {
                    joinDate = obj.join_status_text.text.trim();
                }

                if (memberId && !extractedMembers.some(m => m.memberId === memberId)) {
                    extractedMembers.push({
                        memberName,
                        memberId,
                        memberUrl,
                        memberBio,
                        joinDate
                    });
                }
            }

            if (Array.isArray(obj)) {
                obj.forEach(item => findMemberNodes(item));
            } else {
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        findMemberNodes(obj[key]);
                    }
                }
            }
        }

        findMemberNodes(response.data);
        return extractedMembers;
    }

    static interceptRequests() {
        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function () {
            this.addEventListener("readystatechange", function () {
                if (this.readyState === 4 && this.responseURL.includes("/api/graphql/")) {
                    try {
                        const response = JSON.parse(this.responseText);
                        const members = GroupScraper.extractMemberData(response);
                        Promise.all(members.map((member) => scraperInstance.addMember(member))).catch(e => {});
                    } catch (error) {}
                }
            });
            originalSend.apply(this, arguments);
        };
    }

    startScrolling() {
        if (this.scrollInterval) return; 
        const scrollToBottom = () => window.scrollTo(0, document.body.scrollHeight);
        this.scrollInterval = setInterval(scrollToBottom, 1000); 
    }

    stopScrolling() {
        if (this.scrollInterval) {
            clearInterval(this.scrollInterval);
            this.scrollInterval = null;
            console.log("Scrolling stopped.");
            const startStopBtn = document.querySelector("#fb-member-count").nextElementSibling.nextElementSibling;
            if (startStopBtn) {
                startStopBtn.textContent = "Start Scrolling";
                startStopBtn.style.backgroundColor = "#2196F3";
            }
        }
    }
}

const scraperInstance = new GroupScraper();
GroupScraper.interceptRequests();
