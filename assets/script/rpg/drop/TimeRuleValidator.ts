
type TimeRule = {
    start: Date;
    end: Date;
    daysOfWeek: number[]; // 0-6, 0: Sunday, 1: Monday, ..., 6: Saturday
};

class TimeRuleValidator {
    private cachedRules: Map<string, TimeRule[]> = new Map(); // 使用 Map 缓存解析后的规则

    constructor() {}

    private parseRule(rule: string): TimeRule[] {
        const rules: TimeRule[] = [];
        const parts = rule.split(',');

        for (const part of parts) {
            const timeRange = part.trim().split(' ');
            const timeRangeObj: TimeRule = {
                start: new Date(),
                end: new Date(),
                daysOfWeek: [],
            };

            // 解析时间范围
            for (const range of timeRange) {
                if (range.includes('~')) {
                    const [start, end] = range.split('~').map(str => str.trim());
                    timeRangeObj.start = this.parseDate(start);
                    timeRangeObj.end = this.parseDate(end);
                } else if (range.includes('^')) {
                    const [start, end] = range.split('^').map(str => str.trim());
                    timeRangeObj.start = this.parseDate(start);
                    timeRangeObj.end = this.parseDate(end);
                } else if (range.includes('[') && range.includes(']')) {
                    const days = range.match(/\[(.*?)\]/);
                    if (days) {
                        timeRangeObj.daysOfWeek = days[1].split(',').map(Number);
                    }
                }
            }

            rules.push(timeRangeObj);
        }
        return rules;
    }

    private parseDate(dateStr: string): Date {
        const [datePart, timePart] = dateStr.split('-');
        const [year, month, day] = datePart.split('.').map(Number);
        const [hour, minute] = timePart.split(':').map(Number);
        
        return new Date(year, month - 1, day, hour, minute);
    }

    public isTimeInRange(ruler: string, currentDate: Date): boolean {
        // 检查缓存
        if (!this.cachedRules.has(ruler)) {
            this.cachedRules.set(ruler, this.parseRule(ruler)); // 解析并缓存
        }

        const rules = this.cachedRules.get(ruler)!; // 获取缓存的规则
        const currentTime = currentDate.getTime();
        const dayOfWeek = currentDate.getDay(); // 0-6

        // 遍历规则并检查
        for (const rule of rules) {
            const isInDateRange = currentTime >= rule.start.getTime() && currentTime <= rule.end.getTime();
            const isInDayOfWeek = rule.daysOfWeek.length === 0 || rule.daysOfWeek.includes(dayOfWeek);

            if (isInDateRange && isInDayOfWeek) {
                return true; // 符合规则
            }
        }
        return false; // 不符合任何规则
    }

    public clearCache(): void {
        this.cachedRules.clear(); // 清空缓存
    }
}







// const timeRuleValidator = new TimeRuleValidator();
// const currentDate = new Date(); // 当前时间

// const ruler1 = "2015.10.1-10:00 ~ 2015.10.7-18:0:0"; // 示例规则1
// const ruler2 = "*.8.1-*:* ^ *.9.15-*:* [0,6]"; // 示例规则2

// if (timeRuleValidator.isTimeInRange(ruler1, currentDate)) {
//     console.log("当前时间符合规则1");
// } else {
//     console.log("当前时间不符合规则1");
// }

// if (timeRuleValidator.isTimeInRange(ruler2, currentDate)) {
//     console.log("当前时间符合规则2");
// } else {
//     console.log("当前时间不符合规则2");
// }

// // 如果需要重新解析规则，可以调用 clearCache
// timeRuleValidator.clearCache();