export default {
	"post|/api/teacherstudio/course_replace_scheme_apply/get_table": (op) => {
		let arr = [
			{
				course: "PHP程序设计",
				way: "免修",
			},
			{
				course: "程序设计",
				way: "免修",
			},
		];
		const scheme = [];
		for (const item of arr) {
			scheme.push(item);
		}
		return {
			code: 1,
			msg: "",
			data: {
				id: 1,
				project_code: "方案编号1",
				studio_scode: 162586,
				studio_name: "工作室名称1",
				techer_id: 110111,
				teacher_name: "负责人姓名",
				grade: 1,
				unit_id: 1401,
				unit_title: "受理单位名称",
				job_content: "工作室的工作内容",
				material: "抵换课程所提供的证明材料",
				apply_time: "2020-12-24 10:26:41",
				management_unit_feedback: 1,
				management_unit_feedback_content: "",
				management_unit_signer: "直接管理单位审批人",
				management_unit_feedback_time: "2020-12-24 11:00:40",
				regulatory_unit_feedback: 1,
				regulatory_unit_feedback_content: "监管单位审批人",
				regulatory_unit_signer: "",
				regulatory_unit_feedback_time: "2020-12-24 12:00:40",
				unit_feedback: 1,
				unit_feedback_content: "",
				unit_signer: "受理单位审批人",
				unit_feedback_time: "2020-12-24 13:00:40",
				academic_office_feedback: 0,
				academic_office_feedback_content: "",
				academic_office_signer: "",
				academic_office_feedback_time: "",
				scheme: [...scheme],
			},
		};
	},
};
// id	整型	记录id
// project_code	字符串	承担方案编号
// studio_scode	整型	工作室id
// studio_name	字符串	工作室名称
// teacher_id	整型	负责人id
// teacher_name	字符串	负责人姓名
// grade	整型	工作室等级，0为C级，1为B级，2为A级
// unit_id	整型	受理单位id
// unit_title	字符串	受理单位名称
// job_content	字符串	工作室的工作内容
// material	字符串	抵换课程所提供的证明材料
// apply_time	字符串	申请时间
// management_unit_feedback	整型	直接管理单位审批状态，0审批中，1同意，2不同意
// management_unit_feedback_content	字符串	直接管理单位意见内容
// management_unit_signer	字符串	直接管理单位审批人
// management_unit_feedback_time	字符串	直接管理单位审批时间
// regulatory_unit_feedback	整型	监管单位审批状态，-1待审批，0审批中，1同意，2不同意
// regulatory_unit_feedback_content	字符串	监管单位意见内容
// regulatory_unit_signer	字符串	监管单位审批人
// regulatory_unit_feedback_time	字符串	监管单位审批时间
// unit_feedback	整型	受理单位审批状态，-1待审批，0审批中，1同意，2不同意
// unit_feedback_content	字符串	受理单位意见内容
// unit_signer	字符串	受理单位审批人
// unit_feedback_time	字符串	受理单位审批时间
// academic_office_feedback	字符串	教务处审批状态，-1待审批，0审批中，1同意，2不同意
// academic_office_feedback_content	字符串	教务处意见内容
// academic_office_signer	字符串	教务处审批人
// academic_office_feedback_time	字符串	教务处审批时间
// scheme	json数组	申请内容
